const Discord = require('discord.js');
const util = require('apex-util');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

// Create a new Discord client
const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Sorts and runs events
function controllerPicker(eventName, eventObj) {
  util.log(`${eventName} event received`, 0);
  // Process event against every controller
  Object.keys(controllers).forEach((key) => {
    // Instantiate the controller
    const controllerInstance = new controllers[key](eventObj);
    // console.log(Object.keys(controllerInstance));
    util.log('Controller instance', controllerInstance, 5);
    // Runs commands after constructor is called
    if (controllerInstance.eventName.toLowerCase() === eventName.toLowerCase()) {
      controllerInstance.run();
    }
  });
}

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});

// Listen for messages
client.on('message', (message) => {
  // Make sure that a message object has an !
  if (message.content.charAt(0) === '!') {
    controllerPicker('message', message);
  }
});

client.login(process.env.TOKEN);
