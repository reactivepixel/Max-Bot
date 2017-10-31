module.exports = () => {
  // const util = require('apex-util');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };
  const Discord = require('discord.js');
  const client = new Discord.Client();

  const _commands = (message) => {
    const msg = messageMiddleware(message);
    if (msg.content.toLowerCase() === '!help') {
      message.reply({ embed: {
        color: 3447003,
        // author: {
        //   name: client.user.username,
        //   icon_url: client.user.avatarURL,
        // },
        title: 'Let the !help begin v1.2.3 Discovered Commands: ',
        url: 'https://github.com/joegreen2/Max-Bot',
        description: 'The power of this Bot is **limitless!** Within the limits below:',
        fields: [{
          name: '!broadCast',
          value: 'USE: < !broadcast > command to send a message to selected channels.\nExample: (!broadcast channel1,channel2,channel3 Hello channels this is my message!) \n (seperate channels with \',\' and message starts after the space between channels message.)',
          image: 'bot/img/IMG_1006.JPG',
        },
        {
          name: '!broadCastAll',
          value: 'USE: < !broadcastall > command to send a message to all channels. \nExample: (!broadcastall To all my gamers: Leeroy Jenkins!)',
        },
        {
          name: '!roles',
          value: 'List all Armada Roles.',
        },
        {
          name: '!addRole RoleName',
          value: 'Adds yourself to a role and the related text/voice rooms. ',
        },
        {
          name: '!removeRole RoleName',
          value: 'Removes a role from yourself.',
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
          // icon_url: client.user.avatarURL,
          text: '© Example',
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
