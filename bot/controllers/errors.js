const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { isServerAdmin } = require('../botUtils.js');
const models = require('../../db/models');
const Sequelize = require('sequelize');
const util = require('apex-util');

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

    if (isServerAdmin(message)) {
      models.Member.findOne({ where: { discorduser: message.member.id } })
        .then((user) => {
          util.log('Member query finished');
          if (!user) {
            util.log('User not found');
            message.member.send('You must verify your email before using this feature!.');
            return 'Fail on find user';
          }
          user.update({ receiveerrors: !user.receiveerrors });
          return user.get();
        })
        .then((user) => {
          util.log(user.receiveErrors);
          util.log('Update finished');
          const message = 'what';// `receiveErrors set to ${user.receiveErrors}`;
          return message;
        });

      return 'OK';
    } else {
      this.onError(`User ${message.member.displayName} tried to perform an admin function but wasn't an admin.`, message.member.id);
      return 'You must be in a role that\'s marked as an administrator to use this feature!';
    }
  }

  // Fetches last X errors logged
  fetchErrors() {
    const { message } = this;
    const params = message.parsed[1].split(',');
    let errorCount = 10;

    if (params[0] !== undefined && params[0] !== null && params[0] !== '') {
      errorCount = parseInt(params[0], 10);
    }

    const username = params[1];

    if (isServerAdmin(message)) {
      let query = 'SELECT max.ErrorLogs.id, errormessage, errorTriggeredBy, max.ErrorLogs.createdAt FROM max.ErrorLogs';
      // Is there a username?
      if (username) {
        // Get the id from the username
        const members = message.guild.members;
        const member = members.find('displayName', username);

        if (!member) {
          return `Member ${username} not found.`;
        }

        query += ' JOIN max.Members ON max.ErrorLogs.errorTriggeredBy = max.Members.discorduser' +
                 ` AND max.Members.discorduser = ${member.id}`;
      }

      query += ` ORDER BY max.ErrorLogs.createdAt DESC LIMIT ${errorCount}`;

      let errorLog = '';

      models.sequelize.query(query, { type: Sequelize.QueryTypes.SELECT })
        .then((errors) => {
          errors.forEach((error) => {
            errorLog += `${error.createdAt} - ${error.errormessage} \n`;
          });
          if (username) {
            message.member.send(`Last 10 errors for user ${username}`);
          } else {
            message.member.send('Last 10 errors received');
          }
          message.member.send(errorLog);
        });
      return 'Complete';
    } else {
      this.onError(`User ${message.member.displayName} tried to perform an admin function (${message}) but wasn't an admin.`, message.member.id);
      return 'You must be in a role that\'s marked as an administrator to use this feature!';
    }
  }
}

module.exports = ErrorController;
