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

  // Create a ToS message for new members
  const newMessage = message;
  newMessage.content = message.type === 'GUILD_MEMBER_JOIN' ? '!terms' : new_message.content;

  // Check for ! prefix on message to ensure it is a command
  if (newMessage.content.charAt(0) === '!') {
    util.log('Command message received', newMessage.content, 0);

    // Build basic help string
    let helpString = 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**';

    // Process message against every controller
    Object.keys(controllers).forEach((key) => {
      // Instantiate the controller
      const controllerInstance = new controllers[key](newMessage);
      util.log('Controller instance', controllerInstance, 5);
      // Runs commands after constructor is called
      controllerInstance.run();

      // Loop through commands if help command and add to string
      if (newMessage.content.toLowerCase() === '!help') {
        Object.keys(controllerInstance.commands).forEach((commandKey) => {
          const commandInstance = controllerInstance.commands[commandKey];
          // Check if command should be shown in help menu
          if (commandInstance.showWithHelp) {
            if (commandInstance.adminOnly && isAdmin(newMessage.member)) {
              helpString += `\n\n \`${commandInstance.example}\` **- Admin Only** \n\t ${commandInstance.description}`;
            } else if (commandInstance.adminOnly && !isAdmin(newMessage.member)) {
              helpString += '';
            } else {
              helpString += `\n\n \`${commandInstance.example}\` \n\t ${commandInstance.description}`;
            }
          }
        });
      }
    });

    // If help command called, display string
    if (newMessage.content.toLowerCase() === '!help') {
      newMessage.reply(helpString);
    }
  }
});

// Listen out for new users to the discord
client.on('guildMemberAdd', (member) => {
  // Add new welcome message to general
  const mainChannel = member.guild.channels.find('name', 'general');
  mainChannel.send(`Hi, ${member}. It's nice to meet you!`);
});

// Listen out for members that leave the discord
client.on('guildMemberRemove', (member) => {
  // Add a message for someone leaving the discord
  const mainChannel = member.guild.channels.find('name', 'general');
  mainChannel.send(`${member} has left... it was nice knowing you! ;-;`);
});

client.login(process.env.TOKEN);
