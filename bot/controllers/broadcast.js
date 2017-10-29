module.exports = () => {
  const util = require('apex-util');

  const disallowedChannel = ['admin', 'moderator', 'tester', 'crew', 'fleet officer', '@everyone'];
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');

  const _channels = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcast') {
      const channels = [];
      // const channelsSelected = msg.map();

      // const a = msg.map(chnl => chnl);
      util.log('----------------------STARTING LOGS--------------------');
      util.log(message);
      util.log(msg.parsed);
      util.log('----------------------ENDING LOGS--------------------');

      if (!message.guild) return noGuildFault(message);
      message.guild.channels.map((channel) => {
        if (!disallowedChannel.includes(channel.name.toLowerCase())) {
          return channels.push(channel.name);
        }
        return channel.name;
      });

      const formattedChannel = channels.join('\n');

      // message.author.send('List of all Armada Channels: \n\n' + formattedChannel);
      return message.reply('List of all Armada Channels: \n\n' + formattedChannel);
      // return message.reply('Check your PMs :wink:');
    }
    return false;
  };

  return {
    channels: _channels,
  };
};
