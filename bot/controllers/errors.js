const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { isServerAdmin } = require('../botUtils.js');
const models = require('../../db/models');
const Sequelize = require('sequelize');

class ErrorController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!toggleErrors',
        '!toggleErrors',
        'Toggle Show/Hide Bot Errors',
        'If enabled, bot errors will be sent to you via dm.',
        this.toggleErrors.bind(controller),
        'dm',
      ),
      new Command(
        '!fetchErrors',
        '!fetchErrors [errorCount],[username]',
        'Fetch the last X number of errors the bot has logged',
        'Retrieve the last X number of errors the bot has logged. ' +
        'If you provide a username, it will filter based on that user.',
        this.fetchErrors.bind(controller),
        'dm',
      ),
    ];
  }

  // Enables or disables error presentation to use with correct role.
  toggleErrors() {
    const { message } = this;

    // Server Admin function only
    if (isServerAdmin(message.member)) {
      models.Member.findOne({ where: { discorduser: message.member.id } })
        .then((user) => {
          if (!user) {
            // User has not verified their email yet.
            message.member.send('You must verify your email before using this feature!.');
            return 'Fail on find user';
          }
          // Toggle receiveerrors field in DB for user
          user.update({ receiveerrors: !user.receiveerrors });
          return user.get();
        })
        .then((user) => {
          if (user.receiveerrors === false) {
            message.member.send('You are no longer receiving error messages');
            return false;
          }
          message.member.send('You are now receiving error messages');
          return true;
        });

      return 'OK';
    } else {
      // Log devious action!
      this.onError(`User ${message.member.displayName} tried to perform an admin function (${message}) but wasn't an admin.`, message.member.id, message);
      return 'You must be in a role that\'s marked as an administrator to use this feature!';
    }
  }

  // Sends error DMs to any admins with toggleErrors set to true
  sendErrors(errorMessage, displayName, messageContent) {
    const { message } = this;

    // Check if any admins are set to receive errors
    models.Member.findAll({ where: { receiveerrors: true } })
      .then((members) => {
        if (members.length > 0) {
          members.forEach((member) => {
            const adminUser = message.member.guild.members.get(member.discorduser);
            // Make sure the user that's about to receive the error message is still an admin
            if (isServerAdmin(adminUser)) {
              adminUser.send(`User ${displayName} triggered the following error: \n\n Command: ${messageContent} \n Error: ${errorMessage}`);
            }
          });
        }
      });
    return true;
  }

  // Fetches last X errors logged
  fetchErrors() {
    const { message } = this;
    let params = [];

    if (message.parsed[1] !== undefined) {
      params = message.parsed[1].split(',');
    }

    let errorCount = 10;
    // Set errorCount if one was provided
    if (params[0] !== undefined && params[0] !== null && params[0] !== '') {
      if (!isNaN(parseInt(params[0], 10))) {
        errorCount = parseInt(params[0], 10);
      }
    }

    const username = params[1];

    if (isServerAdmin(message.member)) {
      // Get the id from the username
      const members = message.guild.members;
      const member = username ? members.find('displayName', username) : undefined;

      const replc = [];

      let query = 'SELECT max.ErrorLogs.id, errormessage, errorTriggeredBy, max.ErrorLogs.createdAt FROM max.ErrorLogs';
      // Is there a username?
      if (username) {
        if (!member) {
          return `Member ${username} not found.`;
        }

        query += ' JOIN max.Members ON max.ErrorLogs.errorTriggeredBy = max.Members.discorduser' +
                 ' AND max.Members.discorduser = ?';

        replc.push(member.id);
      }

      query += ' ORDER BY max.ErrorLogs.createdAt DESC LIMIT ?';

      replc.push(errorCount);

      let errorLog = '';

      models.sequelize.query(query, { replacements: replc, type: Sequelize.QueryTypes.SELECT })
        .then((errors) => {
          errors.forEach((error) => {
            errorLog += `${error.createdAt} - ${error.errormessage} \n`;
          });
          if (errorLog.length > 2000) {
            message.member.send('Character limit of 2000 exceeded. Please reduce the number of error messages returned (discord limitation)');
            return false;
          }
          if (username) {
            message.member.send(`Last ${errorCount} errors for user ${username}`);
          } else {
            message.member.send(`Last ${errorCount} errors received`);
          }
          message.member.send(errorLog);
          return true;
        });
      return 'Complete';
    } else {
      this.onError(`User ${message.member.displayName} tried to perform an admin function (${message}) but wasn't an admin.`, message.member.id, message);
      return 'You must be in a role that\'s marked as an administrator to use this feature!';
    }
  }
}

module.exports = ErrorController;
