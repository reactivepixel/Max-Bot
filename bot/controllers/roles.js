module.exports = () => {
  const util = require('apex-util');
//
//
//
//   const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');
//
//   const _roles = (message) => {
//     const info = { cmd: '!roles', desc: 'List all Armada Roles', showWithHelp: true };
//     const msg = messageMiddleware(message);
//     if (msg.parsed[0].toLowerCase() === info.cmd) {
//       const roles = [];
//       if (!message.guild) return noGuildFault(message);
//       message.guild.roles.map((role) => {
//         if (!disallowedRoles.includes(role.name.toLowerCase())) {
//           return roles.push(role.name);
//         }
//         return role.name;
//       });
//
//       const formattedRole = roles.join('\n');
//
//       message.author.send('List of all Armada Roles: \n\n' + formattedRole);
//       return message.reply('Check your PMs :wink:');
//     } else if (msg.parsed[0].toLowerCase() === '!help') {
//
//     }
//     return false;
//   };
//
//
//   // const _roles = (message) => {
//   //   const info = { cmd: '!roles', desc: 'List all Armada Roles', showWithHelp: true };
//
//
//
//
//
//
//   const _addAllRoles = (message) => {
//     const msg = messageMiddleware(message);
//     if (msg.parsed[0].toLowerCase() === '!addallroles') {
//       if (!message.guild) return noGuildFault(message);
//       message.guild.roles.map((role) => {
//         if (!disallowedRoles.includes(role.name.toLowerCase())) {
//           return message.member.addRole(role).catch(util.log);
//         }
//         return role.name;
//       });
//
//       return message.reply('Adding you to all Roles. You\'re going to be drinking from the firehose :sob:');
//     }
//     return false;
//   };
//
//   const _removeAllRoles = (message) => {
//     const msg = messageMiddleware(message);
//     if (msg.parsed[0].toLowerCase() === '!removeallroles') {
//       if (!message.guild) return noGuildFault(message);
//       message.guild.roles.map((role) => {
//         if (!disallowedRoles.includes(role.name.toLowerCase())) {
//           return message.member.removeRole(role).catch(util.log);
//         }
//         return role.name;
//       });
//
//       return message.reply('Removing all roles. Back to basics.');
//     }
//     return false;
//   };
//
//   const _addRole = (message) => {
//     util.log('passed', message.content);
//     const msg = messageMiddleware(message);
//     if (msg.parsed[0].toLowerCase() === '!addrole') {
//       // TODO: Reduce Code Duplication
//       if (!message.guild) return noGuildFault(message);
//       const targetRole = message.guild.roles.find('name', msg.parsed[1]);
//       if (targetRole === null) {
//         return message.reply('"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)');
//       }
//       if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
//         return message.reply('You are not worthy.');
//       }
//
//       // TODO: Handle error to respond with message
//       // TODO: Change catch to pass to util.error... will need created
//       message.member.addRole(targetRole).catch(util.log);
//       // TODO: Create verbose response toggle?
//       // message.reply(targetRole.name + ' added.');
//       return true;
//     }
//     return false;
//   };
//
//   const _removeRole = (message) => {
//     const msg = messageMiddleware(message);
//     if (msg.parsed[0].toLowerCase() === '!removerole') {
//       // TODO: Reduce Code Duplication
//       if (!message.guild) return noGuildFault(message);
//       const targetRole = message.guild.roles.find('name', msg.parsed[1]);
//       if (targetRole === null) {
//         return message.reply('"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)');
//       }
//       if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
//         return message.reply('You have not the power or the will to control this power.');
//       }
//
//       // TODO: Handle error to respond with message
//       // TODO: Change catch to pass to util.error... will need created
//       message.member.removeRole(targetRole).catch(util.log);
//       message.reply(targetRole.name + ' removed.');
//       return true;
//     }
//     return false;
//   };
//
//   return {
//     addRole: _addRole,
//     removeRole: _removeRole,
//     roles: _roles,
//     addAllRoles: _addAllRoles,
//     removeAllRoles: _removeAllRoles,
//   };
// };
// //
// //
// //
// //
// //``


  const run = (message) => {
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
        action: (message, ctrl, msg) => {
          const roles = [];
          message.guild.roles.map((role) => {
            if (!disallowedRoles.includes(role.name.toLowerCase())) {
              return roles.push(role.name);
            }
            return role.name;
          });
          return 'List of all Armada Roles: \n\n' + roles.join('\n');
        }
      },
      {
        cmd: '!addRole',
        example: '!addRole <role_name>',
        title: 'Add Role',
        desc: 'Add a single role to yourself.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'dm',
        action: (message, ctrl, msg) => {
          const targetRole = message.guild.roles.find('name', msg.parsed[1]);
          util.log('=================================================', targetRole, 2);
          if (targetRole === null) {
            util.log('No role matched', msg.parsed[1], 2);
            return '"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
          } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
            util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
            return 'You are not worthy of the role ' + msg.parsed[1] + '.';
          } else {
            util.log('Adding Role to user', targetRole.name, 2);
            message.member.addRole(targetRole).catch(util.log);
            return "Rgr that.";
          }

          return false;
        }
      },
    ];

    const onSuccess = (message, res, ctrl) => {
      if(res !== null){
        if (ctrl.resType === 'reply') {
          return message.reply('I Broke... Beep...Boop...Beep');
        } else if (ctrl.resType === 'dm'){
          return message.author.send(res);
        }
      }
      // Fail Safe
      return false;
    };

    const onError = (message, res, ctrl) => {
      return message.reply('I Broke... Beep...Boop...Beep');
    };

    const res = { help: [] };
    const disallowedRoles = ['admin', 'moderator', 'tester', 'crew', 'fleet officer', '@everyone'];

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
        if (!ctrl.alllowInDM) {
          if (!message.guild) return noGuildFault(message);
        }

        // Do Stuff
        const res = ctrl.action(message, ctrl, msg);
        if (res) {
          onSuccess(message, res, ctrl);
        } else {
          onError(message, res, ctrl);
        }

      }
    });
  }

 return {
   run: run,
 }
}

// v1.2.3 Discovered Commands:
// ``
// List all Armada Roles
// `!addRole` RoleName
// Adds yourself to a role and the related text/voice rooms.
// `!removeRole` RoleName
// Removes a role from yourself.
// `!addAllRoles`
// Add all roles to yourself.
// `!removeAllRoles`
// Remove all roles from yourself.
