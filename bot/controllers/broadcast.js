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
      // pass channel you want to push the message to after !broadcast as msg.parsed[1]
      // msg.parsed[2-?] will hold the message content
      const channelName = msg.parsed[1];

      const broadcastMsg = msg.parsed.slice(1).slice(1).join(' ');
      util.log('!!!!Message Content!!!!', broadcastMsg, 3);

      return message.guild.channels.find('name', channelName).sendMessage('ayo');

      // return message.reply(msg.parsed[1]);
      // return message.reply('banana');
    }
    return false;
  };


  return {
    broadcast: _broadcast,
  };
};
