module.exports = () => {
  const util = require('apex-util');
  const Command = require('../baseCommand.js');

  const _run = (message) => {
    const disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];

    const rolesAction = (message) => {
      const roles = [];
      util.log('help!', message);
      message.guild.roles.map((role) => {
        if (!disallowedRoles.includes(role.name.toLowerCase())) {
          return roles.push(role.name);
        }
        return role.name;
      });
      return 'List of all Armada Roles: \n\n' + roles.join('\n');
    };

    const addRoleAction = (message, ctrl, msg) => {
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
    };

    const addRolesAction = (message, ctrl, msg) => {
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
    };

    const removeRoleAction = (message, ctrl, msg) => {
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
    };

    const addAllRolesAction = (message) => {
      message.guild.roles.map((role) => {
        if (!disallowedRoles.includes(role.name.toLowerCase())) {
          return message.member.addRole(role).catch(util.log);
        }
        return role.name;
      });

      return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
    };

    const removeAllRolesAction = (message) => {
      message.guild.roles.map((role) => {
        if (!disallowedRoles.includes(role.name.toLowerCase())) {
          return message.member.removeRole(role).catch(util.log);
        }
        return role.name;
      });

      return 'Removing all roles. Back to basics.';
    };

    const ctrls = [
      new Command('!roles', '!roles', 'List All Roles', 'List all Armada Roles', rolesAction, 'dm'),
      new Command('!addRole', '!addRole <role_name>', 'Add Role', 'Add a single role to yourself. Role is case-sensitive.', addRoleAction),
      new Command('!addRoles', '!addRoles <role_name>,<role_name>,<role_name>', 'Add Multiple Specific Roles', 'Add a single role to yourself. Role is case-sensitive.', addRolesAction),
      new Command('!removeRole', '!removeRole <role_name>', 'Remove a single role', 'Remove a single game role from yourself. Role is case-sensitive.', removeRoleAction),
      new Command('!addAllRoles', '!addAllRoles', 'Add All Roles', 'Add every game role to yourself.', addAllRolesAction),
      new Command('!removeAllRoles', '!removeAllRoles', 'Remove All Roles', 'Remove every game role from yourself.', removeAllRolesAction),
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

  return {
    run: _run,
  };
};
