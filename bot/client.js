const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');

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

    // Build basic help string
    let helpString = 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**';

    // Process message against every controller
    Object.keys(controllers).forEach((key) => {
      // Instantiate the controller
      const controllerInstance = new controllers[key](message);
      util.log('Controller instance', controllerInstance, 5);
      // Runs commands after constructor is called
      controllerInstance.run();

      // Loop through commands if help command and add to string
      if (message.content.toLowerCase() === '!help') {
        Object.keys(controllerInstance.commands).forEach((commandKey) => {
          const commandInstance = controllerInstance.commands[commandKey];
          // Check if command should be shown in help menu
          if (commandInstance.showWithHelp) {
            if (commandInstance.adminOnly && isAdmin(message.member)) {
              helpString += `\n\n \`${commandInstance.example}\` **- Admin Only** \n\t ${commandInstance.description}`;
            } else if (commandInstance.adminOnly && !isAdmin(message.member)) {
              helpString += '';
            } else {
              helpString += `\n\n \`${commandInstance.example}\` \n\t ${commandInstance.description}`;
            }
          }
        });
      }
    });

    // If help command called, display string
    if (message.content.toLowerCase() === '!help') {
      message.reply(helpString);
    }
  }
});

// Event listener for new members
client.on('guildMemberAdd', (member) => {
  // Send welcome message to members who join
  member.send(`${member}, Welcome to the Full Sail Armada! These are the terms of service...`);
  // Send message to specific channel on the server
  const channel = member.guild.channels.find('name', 'general');
  // If channel is not found do nothing
  if (!channel) return;
  // Send message with members name
  channel.send(`Welcome to the Full Sail Armada ${member}! for more information use !help`);
});

client.login(process.env.TOKEN);
