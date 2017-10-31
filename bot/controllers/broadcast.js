module.exports = () => {
  const util = require('apex-util');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');
  // Broadcast to all channels.
  const _allChannels = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcastall') {
      if (!message.guild) return noGuildFault(message);
      // Seperate the user input by spaces; command shifts over to rid of command.
      const args = msg.content.slice(msg.length).split(/\s+/);
      const command = args.shift().toLowerCase();
      util.log(command);
      const messageStr = args.join(' ');
      const channels = [];
      // Go through all channels and check that it's a text channel if true push to array.
      message.guild.channels.map((channel) => {
        if (channel.type === 'text') {
          channels.push(channel.name);
        }
        return channel.name;
      });
      // For each text channel send message.
      channels.forEach((chnl) => {
        message.guild.channels.find('name', chnl).sendMessage(messageStr);
      });
    }
    return false;
  };
  // Broadcast to selected channels.
  const _broadcast = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcast') {
      if (!message.guild) return noGuildFault(message);
      // Get channels.
      const chnls = msg.parsed[1];
      const chnlsArr = [];
      const channels = message.guild.channels.map(channel => channel);
      Object.keys(channels).forEach((chnl) => {
        if (channels[chnl].type === 'text') {
          chnlsArr.push(channels[chnl].name);
        }
      });
      // Get Message.
      const input = msg.parsed.slice(1).slice(1).join(',').replace(/,/g, ' ');
      // Send message to channels.
      chnls.split(',').forEach((chnl) => {
        message.guild.channels.find('name', chnl).sendMessage(input);
      });
    }
    return false;
  };
  return {
    allChannels: _allChannels,
    broadcast: _broadcast,
  };
};
