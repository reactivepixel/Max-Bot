module.exports = () => {
  const util = require('apex-util');
  const cmds = require('../commandsList');

  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };

  const noGuildFault = message => message.reply('Commands are Discord Server specific, they will not work in PMs. Sorry :cry:');

  const _help = (message) => {
    const msg = messageMiddleware(message);
    let output = 'v1.3.0 Discovered Commands: \n\n ';
    if (msg.content.toLowerCase() === '!help') {
      for (let i = 0; i < cmds.length; i += 1) {
        output += `${cmds[i].cmd} \n\t ${cmds[i].desc} \n\n`;
      }
      message.reply(output);
    }
    return false;
  };

  return {
    help: _help,
  };
};
