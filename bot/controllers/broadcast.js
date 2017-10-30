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
      // Store each channel in array, then loop through array and send message to each channel.

      // if (!message.content.startsWith(prefix) || message.author.bot) return;

      const args = message.content.slice(message.length).split(/\s+/);
      const command = args.shift().toLowerCase();

      util.log('----------------------STARTING LOGS--------------------');
      util.log(message);
      util.log(args);
      util.log(command);
      util.log('----------------------Storing Msg--------------------');
      // util.log(msg);
      // util.log('#213134809172672512');
      util.log('----------------------Array Storing--------------------');
      // client.channels.get('#213134809172672512').send('My Message');
      util.log('----------------------ENDING LOGS--------------------');
      // message.reply('My Message is this test!');
      message.guild.channels.find('name', 'tabletopcitadel').sendMessage('blabla');


      // -----------------------------------------------------
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
