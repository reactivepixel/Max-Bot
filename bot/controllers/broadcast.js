module.exports = () => {
  // const util = require('apex-util');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const _allChannels = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcast-all') {
      const channels = message.guild.channels.map(channel => channel);
      Object.keys(channels).forEach((el) => {
        if (channels[el].type === 'text') {
          channels[el].send('sending it for every channel');
        }
      });
    }
    return true;
  };
  return {
    allChannels: _allChannels,
  };
};
