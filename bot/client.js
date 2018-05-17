const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

// Create a new Discord client
const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();
const events = require('./events')();

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});

function eventPicker(event, eventObj) {
  // Check for ! prefix on message to ensure it is a command
  if (event === 'message' && eventObj.content.charAt(0) === '!') {
    util.log('Command message received', eventObj.content, 0);

    // Build basic help string
    let helpString = 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**';

    // Process message against every controller
    Object.keys(controllers).forEach((key) => {
      // Instantiate the controller
      const controllerInstance = new controllers[key](eventObj);
      util.log('Controller instance', controllerInstance, 5);
      // Runs commands after constructor is called
      controllerInstance.run();

      // Loop through commands if help command and add to string
      if (eventObj.content.toLowerCase() === '!help') {
        Object.keys(controllerInstance.commands).forEach((commandKey) => {
          const commandInstance = controllerInstance.commands[commandKey];
          // Check if command should be shown in help menu
          if (commandInstance.showWithHelp) {
            if (commandInstance.adminOnly && isAdmin(eventObj.member)) {
              helpString += `\n\n \`${commandInstance.example}\` **- Admin Only** \n\t ${commandInstance.description}`;
            } else if (commandInstance.adminOnly && !isAdmin(eventObj.member)) {
              helpString += '';
            } else {
              helpString += `\n\n \`${commandInstance.example}\` \n\t ${commandInstance.description}`;
            }
          }
        });
      }
    });

    // If help command called, display string
    if (eventObj.content.toLowerCase() === '!help') {
      eventObj.reply(helpString);
    }
  }

  if (event === 'guildMemberAdd') {
    // Process message against every controller
    Object.keys(events).forEach((key) => {
      // Instantiate the controller
      const eventInstance = new events[key](eventObj);
      util.log('Event instance', eventInstance, 5);
      // Runs commands after constructor is called
      eventInstance.run();
    });
  }
}

// Create an event listener for new guild members
client.on('guildMemberAdd', (member) => {
  eventPicker('guildMemberAdd', member);
});

// Listen for messages
client.on('message', (message) => {
  eventPicker('message', message);
});

client.login(process.env.TOKEN);
