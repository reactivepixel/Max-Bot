module.exports = () => {
const util = require('apex-util');

const disallowedRoles = ['admin', 'moderator'];
  messageMiddleware = (message) => {
    message.parsed = message.content.split(' ');
    return message;
  }
  _addRole = (message) => {
    util.log('passed', message.content);
    const msg = messageMiddleware(message);
    if(msg.parsed[0].toLowerCase() === '!addrole'){
      // TODO: Reduce Code Duplication
      let targetRole = message.guild.roles.find('name', msg.parsed[1])
      if(targetRole === null){
        return message.reply('"' + msg.parsed[1] + '" is not a known role.')
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
      let targetRole = message.guild.roles.find('name', msg.parsed[1])
      if(targetRole === null){
        return message.reply('"' + msg.parsed[1] + '" is not a known role.')
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
  }
}
