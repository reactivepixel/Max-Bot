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

  // Save users selected channels and created message.
  // const selectedChannels = [];
  // const messageStr = '';

  // User gets to see all channels they can select to send message to.
  const _broadcast = (message) => {
    const msg = messageMiddleware(message);
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

      return message.reply('List of all Armada Channels: \n\n' + formattedChannel + '\n\n USE: \'!channels\' command to choose which Channels to send message to. \n (seperate each channel with a space).');
    }
    return false;
  };
  // User selects channels to send a message to.
  const _channels = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!channels') {
      if (!message.guild) return noGuildFault(message);

      const args = message.content.slice(message.length).split(/\s+/);
      const command = args.shift().toLowerCase();

      args.forEach((chnl) => {
        selectedChannels.push(chnl);
      });
      const formattedChannel = selectedChannels.join('\n');

      return message.reply('List of your selected channels to broadcast to: \n\n' + formattedChannel + '\n\n USE: \'!message\' command followed by your message you want to send to these channels.');
    }
    return false;
  };
  // User builds message and it is then sent out to all channels previously selected.
  const _message = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!message') {
      if (!message.guild) return noGuildFault(message);

      const args = message.content.slice(message.length).split(/\s+/);
      const command = args.shift().toLowerCase();
      const messageStr = args.join(' ');

      // Dynamic code, issue: array values that get set outside of if block,
      // Get erased going into new if block.
      // selectedChannels.forEach((chnl) => {
      //   messageStr = args.join(' ');
      //   message.guild.channels.find('name', chnl).sendMessage(messageStr);
      // });

      // Test code, sends message typed via !message to ttc channel.
      // messageStr = args.join(' ');
      // message.guild.channels.find('name', 'tabletopcitadel').sendMessage(messageStr);

      // Test code, sends message to all channels hard coded into array.
      const selectedChannels = ['general', 'tabletopcitadel', 'lol'];
      selectedChannels.forEach((chnl) => {
        message.guild.channels.find('name', chnl).sendMessage(messageStr);
      });
    }
    return false;
  };
  return {
    channels: _channels,
    broadcast: _broadcast,
    message: _message,
  };
};
