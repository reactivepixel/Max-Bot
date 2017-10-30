module.exports = () => {
  const embedColor = [145, 124, 57];
  const Discord = require('discord.js');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };
  // send message for all channels
  const _allChannels = (message) => {
    const msg = messageMiddleware(message);
    const input = msg.parsed.join(',').replace(/,/g, ' ');
    if (msg.parsed[0].toLowerCase() === '!broadcastall') {
      const channels = message.guild.channels.map(channel => channel);
      Object.keys(channels).forEach((el) => {
        // filter for text channels
        if (channels[el].type === 'text') {
          // creating an object to send a message
          const objEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            // remove the first index of the array in that case are the channels
            .setTitle(`:loudspeaker: ${input.substr(input.indexOf(' ') + 1)}`)
            .setColor(embedColor);
          channels[el].send(objEmbed);
        }
        return true;
      });
    }
    return false;
  };
  // send message specifc channels
  const _chooseChannels = (message) => {
    const msg = messageMiddleware(message);
    const inputChannels = msg.parsed[1];
    // delete the 2 first index of the array and replace `,` for blank space
    const input = msg.parsed.slice(1).slice(1).join(',').replace(/,/g, ' ');
    const validChannels = [];
    if (msg.parsed[0].toLowerCase() === '!broadcastselect') {
      const channels = message.guild.channels.map(channel => channel);
      // loop through channels and push it to an array
      Object.keys(channels).forEach((el) => {
        if (channels[el].type === 'text') {
          validChannels.push(channels[el].name);
        }
        return true;
      });
      // Verify if the user choose a valid channel if yes display the message
      const isValid = inputChannels.split(',').every(r => validChannels.includes(r));
      if (isValid) {
        inputChannels.split(',').forEach((el) => {
          // message.guild.channels.find('name', el).send(input);
          const objEmbed = new Discord.RichEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL)
            // remove the first index of the array in that case are the channels
            .setTitle(`:loudspeaker: ${input}`)
            .setColor(embedColor);
          message.guild.channels.find('name', el).send(objEmbed);
        });
      } else {
        message.reply('you choose invalid channels');
      }
    }
    return false;
  };
  return {
    allChannels: _allChannels,
    chooseChannels: _chooseChannels,
  };
};
