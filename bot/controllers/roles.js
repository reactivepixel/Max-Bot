module.exports = () => {
const util = require('apex-util');

const disallowedRoles = ['admin', 'moderator', 'tester'];
  messageMiddleware = (message) => {
    message.parsed = message.content.split(' ');
    return message;
  }

  noGuildFault = (message) => {
    return message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:')
  };

  _roles = (message) => {
    const msg = messageMiddleware(message);
    if(msg.parsed[0].toLowerCase() === '!roles'){
      const roles = [];
      if(!message.guild) return noGuildFault(message);
      message.guild.roles.map((role) => {
        if(role.name != '@everyone'){
          roles.push(role.name);
        }
      });

      const formattedRole = roles.join('\n')

      message.author.send('List of all Armada Roles: \n\n' + formattedRole);
      return message.reply('Check your PMs :wink:');
    }

  }

  _addRole = (message) => {
    util.log('passed', message.content);
    const msg = messageMiddleware(message);
    if(msg.parsed[0].toLowerCase() === '!addrole'){
      // TODO: Reduce Code Duplication
      if(!message.guild) return noGuildFault(message);
      let targetRole = message.guild.roles.find('name', msg.parsed[1])
      if(targetRole === null){
        return message.reply('"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (The are case-sensitive)')
      }
      if (disallowedRoles.includes(targetRole.name.toLowerCase())){
        return message.reply('You are not worthy.')
      }

      // TODO: Handle error to respond with message
      message.member.addRole(targetRole).catch(console.error);
      message.reply(targetRole.name + ' added to ' + message.member.user.username);
    }
  }

  _removeRole = (message) => {
    const msg = messageMiddleware(message);
    if(msg.parsed[0].toLowerCase() === '!removerole'){
      // TODO: Reduce Code Duplication
      if(!message.guild) return noGuildFault(message);
      let targetRole = message.guild.roles.find('name', msg.parsed[1])
      if(targetRole === null){
        return message.reply('"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (The are case-sensitive)')
      }
      if (disallowedRoles.includes(targetRole.name.toLowerCase())){
        return message.reply('You have not the power or the will to control this power.')
      }

      // TODO: Handle error to respond with message
      message.member.removeRole(targetRole).catch(console.error);
      message.reply(targetRole.name + ' removed from ' + message.member.user.username);
    }
  }

  return {
    addRole: _addRole,
    removeRole: _removeRole,
    roles: _roles,
  }
}
