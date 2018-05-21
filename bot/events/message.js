const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const { generateCode, isAdmin } = require('../botUtils.js');

class MessageEvent extends BaseController {
  constructor(eventObj) {
    // Call BaseController constructor
    super(eventObj);

    this.eventName = 'message';
    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!help',
        '!help',
        'Shows List of Commands',
        'Shows a list of all available commands in the discord bot',
        this.showCommandsAction.bind(controller),
      ),
      new Command(
        '!verify',
        '!verify <email_address>',
        'Verify Email Address',
        'Verify your Full Sail email address. Must be @student.fullsail.edu or @fullsail.com.',
        this.verifyAction.bind(controller),
      ),
      new Command(
          '!roles',
          '!roles',
          'List All Roles',
          'List all available Armada roles.',
          this.rolesAction.bind(controller),
          'dm',
      ),
      new Command(
        '!addRole',
        '!addRole <role_name>',
        'Add Role',
        'Add a single role to yourself. Role is case-sensitive.',
        this.addRoleAction.bind(controller),
      ),
      new Command(
        '!addRoles',
        '!addRoles <role_name>,[role_name]',
        'Add Multiple Roles',
        'Add multiple roles to yourself. Rolea are case-sensitive.',
        this.addRolesAction.bind(controller),
      ),
      new Command(
        '!removeRole',
        '!removeRole <role_name>',
        'Remove Role',
        'Remove a single role from yourself. Role is case-sensitive.',
        this.removeRoleAction.bind(controller),
      ),
      new Command(
        '!addAllRoles',
        '!addAllRoles',
        'Add All Roles',
        'Add every game role to yourself.',
        this.addAllRolesAction.bind(controller),
      ),
      new Command(
        '!removeAllRoles',
        '!removeAllRoles',
        'Remove All Roles',
        'Remove every game role from yourself.',
        this.removeAllRolesAction.bind(controller),
      ),
      new Command(
        '!channels',
        '!channels',
        'List All Channels',
        'List all available Armada channels.',
        this.channelsAction.bind(controller),
        'dm',
      ),
      new Command(
        '!announce',
        '!announce <channel_name>,[channel_name] <eventObj>',
        'Announce To Channels',
        'Broadcast to multiple channels. Channels are case-sensitive.',
        this.announceAction.bind(controller),
        'reply',
        true,
      ),
    ];

    // User roles commands cannot change
    this.disallowedRoles = [
      'admin', 'armada officers', 'armada officer',
      'moderator', 'privateers', 'privateer',
      'tester', 'crew', 'fleet officer', '@everyone',
    ];
  }

  showCommandsAction() {  
    const { eventObj } = this;
    let helpString = 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**';
    // Loop through commands if help command and add to string
    this.commands.forEach((command) => {
      if (command.showWithHelp) {
        if (command.adminOnly && isAdmin(eventObj.member)) {
          helpString += `\n\n \`${command.example}\` **- Admin Only** \n\t ${command.description}`;
        } else if (command.adminOnly && !isAdmin(eventObj.member)) {
          helpString += '';
        } else {
          helpString += `\n\n \`${command.example}\` \n\t ${command.description}`;
        }
      }
    })
    return eventObj.reply(helpString);
  }

  // Lists all roles
  rolesAction() {
    const { eventObj, disallowedRoles } = this;
    const roles = [];
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return roles.push(role.name);
      }
      return role.name;
    });
    return 'List of all Armada Roles: \n\n' + roles.join('\n');
  }

  // Adds a role to the user
  addRoleAction() {
    const { eventObj, disallowedRoles } = this;
    const targetRole = eventObj.guild.roles.find('name', eventObj.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', eventObj.parsed[1], 2);
      return '"' + eventObj.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You are not worthy of the role ' + eventObj.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      eventObj.member.addRole(targetRole).catch(util.log);
      return 'Added the role "' + targetRole.name + '".';
    }
  }

  // Adds multiple roles to the user
  addRolesAction() {
    const { eventObj, disallowedRoles } = this;
    const roles = eventObj.parsed[1].split(',');
    util.log('Multiple Roles Parsing', roles, 4);

    roles.map((role) => {
      if (!disallowedRoles.includes(role.toLowerCase())) {
        const targetRole = eventObj.guild.roles.find('name', role);
        util.log('Asking API for Role', targetRole, 4);

        if (targetRole === null) {
          return '"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
        }
        return eventObj.member.addRole(targetRole).catch(util.log);
      }
      return role.name;
    });

    return 'All set!';
  }

  // Removes role from user
  removeRoleAction() {
    const { eventObj, disallowedRoles } = this;
    const targetRole = eventObj.guild.roles.find('name', eventObj.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', eventObj.parsed[1], 2);
      return '"' + eventObj.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    }
    if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You have not the power or the will to control this power.';
    }

    util.log('Removing role from user', targetRole.name, 2);
    eventObj.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + ' removed.';
  }

  // Adds all roles to user
  addAllRolesAction() {
    const { eventObj, disallowedRoles } = this;
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return eventObj.member.addRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
  }

  // Removes all roles from user
  removeAllRolesAction() {
    const { eventObj, disallowedRoles } = this;
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return eventObj.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Removing all roles. Back to basics.';
  }

  channelsAction() {
    const { eventObj } = this;
    const channels = [];
    eventObj.guild.channels.map(channel => channels.push(channel.name));
    return 'List of all Armada Channels: \n\n' + channels.join('\n');
  }

  announceAction() {
    const { eventObj } = this;
    const channels = eventObj.parsed[1].split(',');
    util.log('Multiple Channels Parsing', channels, 4);

    channels.map((channel) => {
      const targetChannel = eventObj.guild.channels.find('name', channel);
      const sender = eventObj.author.username;
      util.log('Asking API for Channel', targetChannel, 4);

      if (targetChannel === null) {
        return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all Channels (They are case-sensitive)';
      }

      // Set parsed value to 2 for eventObj.
      let msgParsedIndex = 2;
      let preparedMessage = '';

      // Loop through/join user eventObj by space until end.
      while (msgParsedIndex < eventObj.parsed.length) {
        // Add spaces after first word
        if (msgParsedIndex !== 2) {
          preparedMessage += ' ';
        }
        preparedMessage += eventObj.parsed[msgParsedIndex];
        msgParsedIndex += 1;
      }
      return targetChannel.send(sender + ' has an announcment: ```' + preparedMessage + '```');
    });

    return 'Broadcast sent!';
  }

  // Verifies Full Sail email addresses
  verifyAction() {
    const { eventObj } = this;
    const targetVerifiedRoleName = 'Crew';
    const validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
    const timeoutInMiliseconds = 600000;
    const email = eventObj.parsed[1].toLowerCase();
    const emailDomain = email.split('@').pop();

    // We can set `codeLength` to whatever length we want the verif code to be.
    // Recommend ngt 8 digits.
    if (validDomains.includes(emailDomain)) {
      const codeLength = 6;
      // code to equal value generated
      const code = generateCode(codeLength);

      util.log('code', code, 3);
      // TODO: Set `time` prop to 600000 (10min)
      const collector = eventObj.channel.createMessageCollector(
        m => m.content.includes(code),
        { time: timeoutInMiliseconds });
      collector.on('collect', (m) => {
        const verifyUser = 'Welcome aboard, Crewmate!';
        const userAlredyOnSystem = 'This email has already been verified to a discord user.';
        models.Member.findOne({ where: { email } }).then((matchedUserData) => {
          if (matchedUserData === null) {
            // no existing record found
            models.Member.create({
              discorduser: m.author.id,
              email,
              uuid: uuidv4(),
              verified: 1,
            });
            // mapping guild roles to find the crew role id
            const targetRole = eventObj.guild.roles.find('name', targetVerifiedRoleName);
            eventObj.member.addRole(targetRole).catch(util.log);
            eventObj.reply(verifyUser);
          } else {
            // existing record found
            eventObj.reply(userAlredyOnSystem);
          }
        });
        util.log('Collected', m.content, 3);
      });
      collector.on('end', (collected) => {
        const verificationTimeout = `!verify timeout. Clap ${collected.author.username} in irons!  Let's see how well they dance on the plank!`;
        util.log('Items', collected.size, 3);
        if (collected.size === 0) {
          // TODO: ping admin team on verification fail
          eventObj.reply(verificationTimeout);
        }
      });
      // Set up Nodemailer to send emails through gmail
      const sendVerifyCode = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS,
        },
      });
      // Nodemailer email recipient & message
      // TODO: Build email template
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Armada Verification Code',
        html: `<table><tr><td><p>Enter the code below into Discord, in the same channel on the Armada Server. Verification will timeout after ${(timeoutInMiliseconds / 1000) / 60} minutes from first entering the !verify command.</p></td></tr><tr><td><h2>Verification Code: ${code}</h2></td></tr></table>`,
      };
      // Call sendMail on sendVerifyCode
      // Pass mailOptions & callback function
      sendVerifyCode.sendMail(mailOptions, (err, info) => {
        const errorMsg = 'Oops, looks like the email can not be sent. It\'s not you, it\'s me. Please reach out to a moderator to help you verify.';
        if (err) {
          eventObj.reply(errorMsg);
          util.log('Email not sent', err, 3);
        } else {
          util.log('Email details', info, 3);
        }
      });

      util.log('Code', code, 3);
      return `...What's the passcode? \n\n *eyes you suspicously*\n\n I just sent it to your email, just respond back to this channel within ${(timeoutInMiliseconds / 1000) / 60} minutes, with the code, and I won't treat you like a scurvy cur!`;
    } else {
      return 'Sorry, I can only verify Full Sail University email addresses.';
    }
  }
}

module.exports = MessageEvent;
