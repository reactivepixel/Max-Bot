module.exports = () => {
  const util = require('apex-util');

  const disallowedRoles = ['admin', 'moderator', 'tester', 'crew', 'fleet officer', '@everyone'];
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');

  const _roles = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!roles') {
      const roles = [];
      if (!message.guild) return noGuildFault(message);
      message.guild.roles.map((role) => {
        if (!disallowedRoles.includes(role.name.toLowerCase())) {
          return roles.push(role.name);
        }
        return role.name;
      });

      const formattedRole = roles.join('\n');

      message.author.send('List of all Armada Roles: \n\n' + formattedRole);
      return message.reply('Check your PMs :wink:');
    }
    return false;
  };

  const _addRole = (message) => {
    util.log('passed', message.content);
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!addrole') {
      // TODO: Reduce Code Duplication
      if (!message.guild) return noGuildFault(message);
      const targetRole = message.guild.roles.find('name', msg.parsed[1]);
      if (targetRole === null) {
        return message.reply('"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)');
      }
      if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
        return message.reply('You are not worthy.');
      }

      // TODO: Handle error to respond with message
      // TODO: Change catch to pass to util.error... will need created
      message.member.addRole(targetRole).catch(util.log);
      // TODO: Create verbose response toggle?
      // message.reply(targetRole.name + ' added.');
      return true;
    }
    return false;
  };

  const _removeRole = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!removerole') {
      // TODO: Reduce Code Duplication
      if (!message.guild) return noGuildFault(message);
      const targetRole = message.guild.roles.find('name', msg.parsed[1]);
      if (targetRole === null) {
        return message.reply('"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)');
      }
      if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
        return message.reply('You have not the power or the will to control this power.');
      }

      // TODO: Handle error to respond with message
      // TODO: Change catch to pass to util.error... will need created
      message.member.removeRole(targetRole).catch(util.log);
      message.reply(targetRole.name + ' removed.');
      return true;
    }
    return false;
  };

  return {
    addRole: _addRole,
    removeRole: _removeRole,
    roles: _roles,
  };
};
