const Discord = require('discord.js');
const util = require('apex-util');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});

// Listen for messages
client.on('message', (message) => {
  // Check for ! prefix on message to ensure it is a command
  if (message.content.charAt(0) === '!') {
    util.log('Command message received', message.content, 0);

    // Process message against every controller
    Object.keys(controllers).forEach((key) => {
      // Instantiate the controller
      const controllerInstance = new controllers[key](message);
      util.log('Controller instance', controllerInstance, 5);
      // Runs commands after constructor is called
      controllerInstance.run();
    });

    // TODO: Improve help message
    if (message.content.toLowerCase() === '!help') {
      message.reply('v1.3.2 Discovered Commands: \n `!roles` \n\t List all Armada Roles \n\n `!addRole` RoleName \n\t Adds yourself to a role and the related text/voice rooms. \n\n `!removeRole` RoleName \n\t Removes a role from yourself. \n\n `!addAllRoles` \n\t Add all roles to yourself. \n\n `!removeAllRoles` \n\t Remove all roles from yourself. \n\n `!verify emailAddress@student.fullsail.com` \n\t Self verify that you are a Full Sail Student / Alumni via your Full Sail email account.');
    }
  }
});

client.login(process.env.TOKEN);
