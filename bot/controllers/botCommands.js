module.exports = () => {
  // const util = require('apex-util');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };
  // Menu displayed with all bot command.
  // Continuous updating need when more commands are added.
  const _commands = (message) => {
    const msg = messageMiddleware(message);
    if (msg.content.toLowerCase() === '!help') {
      message.reply({ embed: {
        color: 3447003,
        author: {
          name: 'Max-Bot',
        },
        title: 'Let the !help begin v1.2.3 Discovered Commands: ',
        url: 'https://github.com/joegreen2/Max-Bot',
        description: 'The power of this Bot is **!limitless** Within the limits below:',
        fields: [{
          name: '!broadCast',
          value: 'USE: < !broadcast > command to send a message to selected channels.\n_Example: (!broadcast channel1++channel2++channel3 Hello channels this is my message!_) \n(seperate channels with  \' ++ \'  and message starts after the space between channels message.)',
        },
        {
          name: '!broadCastAll',
          value: 'USE: < !broadcastall > command to send a message to all channels. \n_Example: (!broadcastall To all my gamers: Leeroy Jenkins!_)',
        },
        {
          name: '!roles',
          value: 'List all Armada Roles.',
        },
        {
          name: '!addRole',
          value: 'Adds yourself to a role and the related text/voice rooms. \n_Example: (!addRole RoleName)_',
        },
        {
          name: '!removeRole',
          value: 'Removes a role from yourself. \n_Example: (!removeRole RoleName)_',
        },
        {
          name: '!addAllRoles',
          value: 'Add all roles to yourself.',
        },
        {
          name: '!removeAllRoles',
          value: 'Remove all roles from yourself.',
        },
        {
          name: '!help',
          value: 'Brings you right back to me.',
        },
        ],
        timestamp: new Date(),
        footer: {
          text: 'Max-Bot',
        },
      },
      });
    }
    return false;
  };
  return {
    commands: _commands,

  };
};
