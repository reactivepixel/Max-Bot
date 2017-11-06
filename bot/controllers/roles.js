const uuidv4 = require('uuid/v4');
const mail = require('../../lib/nodemailer.js');

module.exports = () => {
  const util = require('apex-util');
  const validFSEmail = require('../../lib/emailValidation.js');


  const _run = (message) => {
    const disallowedRoles = ['admin', 'moderator', 'tester', 'crew', 'fleet officer', '@everyone'];
    const ctrls = [
      {
        cmd: '!roles',
        example: '!roles',
        title: 'List All Roles',
        desc: 'List all Armada Roles',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'dm',
        action: (message) => {
          const roles = [];
          message.guild.roles.map((role) => {
            if (!disallowedRoles.includes(role.name.toLowerCase())) {
              return roles.push(role.name);
            }
            return role.name;
          });
          return 'List of all Armada Roles: \n\n' + roles.join('\n');
        },
      },
      {
        cmd: '!addRole',
        example: '!addRole <role_name>',
        title: 'Add Role',
        desc: 'Add a single role to yourself. Role is case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {
          const targetRole = message.guild.roles.find('name', msg.parsed[1]);
          if (targetRole === null) {
            util.log('No role matched', msg.parsed[1], 2);
            return '"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
          } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
            util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
            return 'You are not worthy of the role ' + msg.parsed[1] + '.';
          } else {
            util.log('Adding Role to user', targetRole.name, 2);
            message.member.addRole(targetRole).catch(util.log);
            return 'Added the role "' + targetRole.name + '".';
          }
        },
      },

      {
        cmd: '!addRoles',
        example: '!addRoles <role_name>,<role_name>,<role_name>',
        title: 'Add Multiple Specific Roles',
        desc: 'Add multiple specific roles to yourself. Roles are case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {
          const roles = msg.parsed[1].split(',');
          util.log('Multiple Roles Parsing', roles, 4);

          roles.map((role) => {
            if (!disallowedRoles.includes(role.toLowerCase())) {
              const targetRole = message.guild.roles.find('name', role);
              util.log('Asking API for Role', targetRole, 4);

              if (targetRole === null) {
                return '"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
              }
              return message.member.addRole(targetRole).catch(util.log);
            }
            return role.name;
          });

          return 'All set!';
        },
      },
      {
        cmd: '!removeRole',
        example: '!removeRole <role_name>',
        title: 'Remove a single role',
        desc: 'Remove a single game role from yourself. Role is case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {
          const targetRole = message.guild.roles.find('name', msg.parsed[1]);
          if (targetRole === null) {
            util.log('No role matched', msg.parsed[1], 2);
            return '"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
          }
          if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
            util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
            return 'You have not the power or the will to control this power.';
          }

          util.log('Removing role from user', targetRole.name, 2);
          message.member.removeRole(targetRole).catch(util.log);
          return targetRole.name + ' removed.';
        },
      },
      {
        cmd: '!addAllRoles',
        example: '!addAllRoles',
        title: 'Add All Roles',
        desc: 'Add every game role to yourself.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message) => {
          message.guild.roles.map((role) => {
            if (!disallowedRoles.includes(role.name.toLowerCase())) {
              return message.member.addRole(role).catch(util.log);
            }
            return role.name;
          });

          return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
        },
      },
      {
        cmd: '!removeAllRoles',
        example: '!removeAllRoles',
        title: 'Remove All Roles',
        desc: 'Remove every game role from yourself.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message) => {
          message.guild.roles.map((role) => {
            if (!disallowedRoles.includes(role.name.toLowerCase())) {
              return message.member.removeRole(role).catch(util.log);
            }
            return role.name;
          });

          return 'Removing all roles. Back to basics.';
        },
      },
    ];

    const onSuccess = (message, res, ctrl) => {
      if (res !== null) {
        if (ctrl.resType === 'reply') {
          return message.reply(res);
        } else if (ctrl.resType === 'dm') {
          return message.author.send(res);
        }
      }
      // Fail Safe
      return false;
    };

    const onError = message => message.reply('I Broke... Beep...Boop...Beep');

    const messageMiddleware = (message) => {
      const container = {};
      container.parsed = message.content.split(' ');
      const msg = Object.assign(message, container);
      return msg;
    };

    ctrls.map((ctrl) => {
      util.log('Running through controller', ctrl.cmd, 2);

      const msg = messageMiddleware(message);
      if (msg.parsed[0].toLowerCase() === ctrl.cmd.toLowerCase()) {
        util.log('!!! Matched Ctrl to Cmd !!!', ctrl.cmd, 2);

        // Ensure the communication is happening on a server
        if (!ctrl.allowInDM) {
          if (!message.guild) return onError(message, 'Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
        }

        // Do Stuff
        const res = ctrl.action(message, ctrl, msg);
        if (res) {
          onSuccess(message, res, ctrl);
        } else {
          onError(message, res, ctrl);
        }
      }
      return ctrl;
    });
  };

  // VerifyFS role
  const _verifyFs = (message) => {
    util.log('passed', message.content);
    // const uuid = uuidv4();
    const msg = messageMiddleware(message);    

    if (msg.parsed[0].toLowerCase() === '!verifyfs' && msg.parsed[1].toLowerCase() === 'student') {
      if (!validFSEmail(msg.parsed[2])) {
        return message.reply('"' + msg.parsed[2] + '" is not a valid email address. You have to use a fullsail.com or fullsail.edu to validate as a FS');
      }

      const models = require('../../db/models');
      const userObj = message.guild.members.get(message.guild.ownerID);
      const user = userObj.user;

      const uuid = uuidv4();


      models.Member.create({
        discorduser: user.id,
        email: msg.parsed[2],
        uuid,
        verified: 0,
      }).then((newUser) => {
        const emailData = {
          to: newUser.email,
          subject: 'Maxbot Validaiton Email',
          text: 'Please validate you email by clicking the link below.',
          html: `<h1>Please validate your email</h1><a href="http://localhost/welcome/${uuid}">Validate Your Email</a>`,
        };
        mail(emailData);
      }).catch(util.log);

      return true;
    }
    return false;
  };

  const _addRoles = (message) => {
    util.log('passed', message.content);

    const msg = messageMiddleware(message);

    if (msg.parsed[0].toLowerCase() === '!addroles') {
      if (!message.guild) return noGuildFault(message);
      const roles = msg.parsed[1].split(',');
      util.log('Multiple Roles Parsing', roles, 4);

      roles.map((role) => {
        if (!disallowedRoles.includes(role.toLowerCase())) {
          const targetRole = message.guild.roles.find('name', role);
          util.log('Queing API for Role', targetRole, 4);

          if (targetRole === null) {
            return message.reply('"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)');
          }
          return message.member.addRole(targetRole).catch(util.log);
        }
        return role.name;
      });
    }
    return false;
  };

  return {

    run: _run,
  };
};
