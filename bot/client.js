const Discord = require('discord.js');
const util = require('apex-util');

// If Production server default Debug mode to Production Setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre Load Controllers
const ctrls = require('./controllers')();

client.on('ready', () => {
  util.log('Bot Online and Ready!', 0);
});

client.on('message', (message) => {
  // Check for ! Prefix on message to ensure it is a command
  if (message.content.charAt(0) === '!') {
    util.log('!Cmd Message Received', message.content, 0);

    // Process message against every controller
    Object.keys(ctrls).forEach((ctrlKey) => {
      if (ctrlKey) {
        // initialize the controller

        const ctrlInstance = new ctrls[ctrlKey](message);
        util.log('Controller Instance', ctrlInstance, 5);
      }
    });

    // TODO: Improve help message
    if (message.content.toLowerCase() === '!help') {
      message.reply('v1.3.2 Discovered Commands: \n `!roles` \n\t List all Armada Roles \n\n `!addRole` RoleName \n\t Adds yourself to a role and the related text/voice rooms. \n\n `!removeRole` RoleName \n\t Removes a role from yourself. \n\n `!addAllRoles` \n\t Add all roles to yourself. \n\n `!removeAllRoles` \n\t Remove all roles from yourself. \n\n `!verify emailAddress@student.fullsail.com` \n\t Self verify that you are a Full Sail Student / Alumni via your Full Sail email account.');
    }
  }
});

client.login(process.env.TOKEN);
