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

  const _shout = (message) => {
    const allChannels = message.guild.channels.map(channel => channel);
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!shout') {
      return message.reply('Hey there buckaroo');
    }
    return false;
  };

  const _shoutAll = (message) => {
    let shoutMsg;
    const allChannels = message.guild.channels.map(channel => channel);
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!shoutall') {
      if (!message.guild) return noGuildFault(message);
      shoutMsg = message.content.slice(message.length).split(/\s+/);
      shoutMsg.splice(0, 1);
      const shoutStr = shoutMsg.join(' ');
      Object.keys(allChannels).forEach((i) => {
        if (allChannels[i].type === 'text') {
          allChannels[i].send(`:mega: ${shoutStr}`);
        }
      });
    }
    return false;
  };

  const _selectChannels = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!selectchannels') {
      if (!message.guild) return noGuildFault(message);
      return message.reply('This is your selectChannels command');
    }
    return false;
  };

  return {
    shout: _shout,
    shoutAll: _shoutAll,
    selectChannels: _selectChannels,
  };
};
