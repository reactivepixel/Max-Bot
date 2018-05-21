const Discord = require('discord.js');
const util = require('apex-util');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

// Create a new Discord client
const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Sorts and runs events
function eventPicker(eventName, eventObj) {
  // Check if the event is a message event, and for ! prefix on message to ensure it is a command
  if (eventName === 'message' && eventObj.content.charAt(0) === '!') {
    util.log(`${eventName} event received`, 0);
    // Process message against every controller
    Object.keys(controllers).forEach((key) => {
      // Instantiate the controller
      const eventInstance = new controllers[key](eventObj);
      util.log('Controller instance', eventInstance, 5);
      // Runs commands after constructor is called
      if (eventInstance.eventName.toLowerCase() === eventName.toLowerCase()) {
        eventInstance.run();
      }
    });
  // If not a message event, treat as a normal event
  } else {
    util.log(`${eventName} event received`, 0);
    // Process event against every controller
    Object.keys(controllers).forEach((key) => {
      // Instantiate the controller
      const eventInstance = new controllers[key](eventObj);
      util.log('Event instance', eventInstance, 5);
      // Runs commands after constructor is called
      if (eventInstance.eventName.toLowerCase() === eventName.toLowerCase()) {
        eventInstance.run();
      }
    });
  }
}

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});

// Create an event listener for new guild members
client.on('guildMemberAdd', (member) => {
  eventPicker('guildMemberAdd', member);
});

// Fire whenever a user's presence changes
client.on('presenceUpdate', (user) => {
  eventPicker('presenceUpdate', user);
});

// Listen for messages
client.on('message', (message) => {
  eventPicker('message', message);
});

client.login(process.env.TOKEN);
