module.exports = () => {
  const util = require('apex-util');
  const disallowedChannel = ['admin', 'moderator', 'tester', 'crew', 'fleet officer', '@everyone'];
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  // Save users selected channels
  const selectedChannels = [];

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');

  const _channels = (message) => {
    const msg = messageMiddleware(message);
    // -----------------------------------------------------
    if (msg.parsed[0].toLowerCase() === '!broadcast') {
      const channels = [];
      if (!message.guild) return noGuildFault(message);
      message.guild.channels.map((channel) => {
        if (!disallowedChannel.includes(channel.name.toLowerCase())) {
          if (channel.type === 'text') {
            return channels.push(channel.name);
          }
        }
        return channel.name;
      });

      const formattedChannel = channels.join('\n');

      // message.author.send('List of all Armada Channels: \n\n' + formattedChannel);
      return message.reply('List of all Armada Channels: \n\n' + formattedChannel + '\n\n USE: \'!channels\' command to choose which Channels to send message to. \n (seperate each channel with a space).');
      // return message.reply('Check your PMs :wink:');
    }
    // -----------------------------------------------------
    if (msg.parsed[0].toLowerCase() === '!channels') {
      if (!message.guild) return noGuildFault(message);

      const args = message.content.slice(message.length).split(/\s+/);
      const command = args.shift().toLowerCase();

      args.forEach((chnl) => {
        selectedChannels.push(chnl);
      });

      const formattedChannel = selectedChannels.join('\n');

      return message.reply('List of your selected channels to broadcast to: \n\n' + formattedChannel + '\n\n USE: \'!message\' command followed by your message you want to send to these channels.');

      // -----------------------------------------------------
    }

    if (msg.parsed[0].toLowerCase() === '!message') {
      if (!message.guild) return noGuildFault(message);

      selectedChannels.forEach((chnl) => {
        message.guild.channels.find('name', chnl).sendMessage('blabla');
      });
    }
    return false;
  };
  return {
    channels: _channels,
  };
};
