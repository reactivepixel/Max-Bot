const uuidv4 = require('uuid/v4');
const mail = require('../../lib/nodemailer.js');

module.exports = () => {
  const util = require('apex-util');
  const validFSEmail = require('../../lib/emailValidation.js');

  const disallowedRoles = ['admin', 'moderator', 'tester', 'crew', 'fleet officer', '@everyone'];

  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');

  const _broadcast = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcast') {
      const channelName = msg.parsed[1];
      // removes bang command & channels
      // grabs mesage to be sent
      const broadcastMsg = msg.parsed.slice(1).slice(1).join(' ');
      util.log('!!!!Message Content!!!!', broadcastMsg, 3);
      // allows multiple channel broadcast
      // seperates on |
      channelName.split('|').forEach((channel) => {
        message.guild.channels.find('name', channel).sendMessage(broadcastMsg);
      });
    }
    return false;
  };

  const _broadcastAll = (message) => {
    const msg = messageMiddleware(message);
    if (msg.parsed[0].toLowerCase() === '!broadcastall') {
      // grab all channels
      const channels = message.guild.channels.map(channel => channel);
      const broadcastMsg = msg.parsed.slice(1).join(' ');
      const channelList = [];

      // loop through channels
      // push text channels to channelList
      Object.keys(channels).forEach((channel) => {
        if (channels[channel].type === 'text') {
          channelList.push(channels[channel].name);
        }
      });
      // loop through channelList
      // send message to channels listed
      channelList.forEach((channel) => {
        util.log('!!!!!inside forEach!!!!!!', channel, 3);
        message.guild.channels.find('name', channel).sendMessage(broadcastMsg);
      });
    }
    return false;
  };


  return {
    broadcast: _broadcast,
    brodcastAll: _broadcastAll,
  };
};
