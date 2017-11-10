const Discord = require('discord.js');
const util = require('apex-util');
const models = require('../db/models');

// If Production server default Debug mode to Production Setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre Load Controllers
const ctrls = require('./controllers')();

client.on('ready', () => {
  util.log('Bot Online and Ready!', {}, 0);
});

client.on('message', (message) => {
  // Check for ! Prefix on message to ensure it is a command
  if (message.content.charAt(0) === '!') {
    util.log('!Cmd Message Received', message.content, 0);


    // TODO: Improve help message
    if (message.content.toLowerCase() === '!help') {
      message.reply('v1.3.0 Discovered Commands: \n `!roles` \n\t List all Armada Roles \n\n `!addRole` RoleName \n\t Adds yourself to a role and the related text/voice rooms. \n\n `!removeRole` RoleName \n\t Removes a role from yourself. \n\n `!addAllRoles` \n\t Add all roles to yourself. \n\n `!removeAllRoles` \n\t Remove all roles from yourself. \n\n `!broadcast channel1|channel2 message` \n\t Broadcast to select text channels. \n\n `!broadcastAll message` \n\t Broadcast to all text channels.');
    }


    // Process message against every controller
    Object.keys(ctrls).forEach((ctrlKey) => {
      if (ctrlKey) {
        // initialize the controller
        const ctrlInstance = ctrls[ctrlKey]();

        // Determine the method names of each controller
        const controllerMethodKeys = Object.keys(ctrlInstance);
        util.log('Methods found in controller', controllerMethodKeys, 3);

        // For each method on each controller
        Object.keys(controllerMethodKeys).forEach((controllerMethodKey) => {
          const methodName = controllerMethodKeys[controllerMethodKey];
          const method = ctrlInstance[methodName];

          util.log('Looping Through Each Method within each Controller', method, 4);

          // Pass the message to each method of each controller
          method(message);
        });
      }
    });
  }
});

client.login(process.env.TOKEN);
