module.exports = () => {
  const util = require('apex-util');
  const Discord = require('discord.js');

  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');

  const _shout = (message) => {
    // Raw input from user
    let inputStr;
    // User's message to broadcast
    let shoutStr;
    // Flag to indicate beginning of message
    const msgFlag = '--m';
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!shout') {
      inputStr = message.content.slice(message.length).split(/\s+/);
      // Check that the user flagged the message appropriately
      if (!inputStr.includes(msgFlag)) {
        message.reply(`please make sure you flag the beginning of your message with \`${msgFlag}\`, otherwise I don't know what you're trying to tell people.`);
      }
      // Create message to broadcast by joining everything after `msgFlag`
      shoutStr = inputStr.splice(msg.parsed.indexOf(msgFlag) + 1);
      shoutStr = shoutStr.join(' ');
      // The rest of `inputStr` becomes the channel selection
      const selectedChannels = [...inputStr];
      selectedChannels.shift();
      selectedChannels.pop();
      // Build embed for nicer/more visible display
      const embed = new Discord.RichEmbed()
        .setTitle(':mega: Announcement')
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setColor('#87b1cc')
        .setDescription(`${shoutStr}`)
        .setTimestamp();
      // If selected channel exists, broadcast message
      // Otherwise, notify user of error
      for (let i = 0; i < selectedChannels.length; i += 1) {
        const channel = message.guild.channels.find('name', selectedChannels[i]);
        if (channel && channel.type === 'text') {
          channel.send(embed);
        } else {
          message.reply(`better check your channel names--I can't find a text channel called \`${selectedChannels[i]}\`.`);
        }
      }
    }
    return false;
  };

  const _shoutAll = (message) => {
    let shoutMsg;
    // Get all channels on server
    const allChannels = message.guild.channels.map(channel => channel);
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!shoutall') {
      if (!message.guild) return noGuildFault(message);
      shoutMsg = message.content.slice(message.length).split(/\s+/);
      // Drop command from front of message
      shoutMsg.splice(0, 1);
      const shoutStr = shoutMsg.join(' ');
      // Build embed for nicer/more visible display
      const embed = new Discord.RichEmbed()
        .setTitle(':mega: Announcement')
        .setAuthor(message.author.tag, message.author.displayAvatarURL)
        .setColor('#87b1cc')
        .setDescription(`${shoutStr}`)
        .setTimestamp();
      // Loop through channels and broadcast if channel type is text
      Object.keys(allChannels).forEach((ch) => {
        if (allChannels[ch].type === 'text') {
          allChannels[ch].send(embed);
        }
      });
    }
    return false;
  };

  return {
    shout: _shout,
    shoutAll: _shoutAll,
  };
};
