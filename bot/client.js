const Discord = require('discord.js');
const util = require('apex-util');

// If Production server default Debug mode to Production Setting
if(process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0

const client = new Discord.Client();

// Pre Load Controllers
const ctrls = require('./controllers')();

client.on('ready', () => {
  util.log('Bot Online and Ready!', {}, 0);
});

client.on('message', message => {
  // Check for ! Prefix on message to ensure it is a command
  if (message.content.charAt(0) === '!') {
    util.log('!Cmd Message Received', message.content, 0);


    // TODO: Improve help message
    if(message.content.toLowerCase() === '!help'){
      message.reply('Discovered Commands: \n `!roles` \n\t List all Armada Roles \n\n `!addRole` RoleName \n\t Adds yourself to a role and the related text/voice rooms. \n\n `!removeRole` RoleName \n\t Removes a role from yourself.')
    }


    // Process message against every controller
    for(let ctrlKey in ctrls){
      // initialize the controller
      let ctrlInstance = ctrls[ctrlKey]();

      // Determine the method names of each controller
      controllerMethodKeys = Object.keys(ctrlInstance);
      util.log('Methods found in controller', controllerMethodKeys, 3);

      // For each method on each controller
      for(let controllerMethodKey in controllerMethodKeys){
        let methodName = controllerMethodKeys[controllerMethodKey];
        let method = ctrlInstance[methodName];

        util.log('Looping Through Each Method within each Controller', method, 4);

        // Pass the message to each method of each controller
        method(message);
      }
    }
  }
});

client.login(process.env.TOKEN);
