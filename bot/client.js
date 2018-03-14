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

client.on('presenceUpdate', (oldMember, newMember) => {
  // User: online to offline
  console.log(`${oldMember.user.username}: ${oldMember.presence.status} to ${newMember.presence.status}`);
});

client.on('presenceUpdate', (oldMember, newMember) => {
  // User: online to offline
  console.log(`${oldMember.user.username}: ${oldMember.presence.game.type} / ${newMember.presence.game.type}`);

  // const { message } = this;
  const type = oldMember.presence.game.type;
  const name = oldMember.presence.game.name;

  if (type === null) {
    console.log(' ⚡️⚡️⚡️ ', type);
    return `${oldMember.user.username} Nothing`;
  } else if (type === 0) {
    console.log(oldMember.user.username + ' Playing ' + name + ' type -> ' + type);
    return `${oldMember.user.username} Playing ` + name;
  } else if (type === 1) {
    console.log(oldMember.user.username + ' Streaming ' + name + ' type -> ' + type);
    return `${oldMember.user.username} Streaming ` + name;
  } else if (type === 2) {
    console.log(oldMember.user.username + ' Listening to ' + name + ' type -> ' + type);
    return `${oldMember.user.username} Listening to ` + name;
  } else {
    console.log(' ⭕️⭕️⭕️ ', type);
    return `${oldMember.user.username} Broken`;
  }
});

// This will send the welcome message for new users who join.
client.on('guildMemberAdd', (member) => {
  member.reply(`${member.presence.game.type}, type test`);
});

client.login(process.env.TOKEN);
