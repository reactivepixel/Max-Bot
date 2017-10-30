module.exports = () => {
  const Discord = require('discord.js');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };
  const _allChannels = (message) => {
    const msg = messageMiddleware(message);
    const input = msg.parsed.join(',').replace(/,/g, ' ');
    if (msg.parsed[0].toLowerCase() === '!broadcastall') {
      const channels = message.guild.channels.map(channel => channel);
      Object.keys(channels).forEach((el) => {
        if (channels[el].type === 'text') {
          const objEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            .setTitle(`:loudspeaker: ${input.substr(input.indexOf(' ') + 1)}`)
            .setColor([145, 124, 57]);
          channels[el].send(objEmbed);
        }
        return true;
      });
    }
    return false;
  };
  const _chooseChannels = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcastChoose') {
      const channels = message.guild.channels.map(channel => channel);
      Object.keys(channels).forEach((el) => {
        if (channels[el].type === 'text') {
          channels[2].send('sending message for a specific channel');
        }
        return true;
      });
    }
    return false;
  };
  return {
    allChannels: _allChannels,
    chooseChannels: _chooseChannels,
  };
};
