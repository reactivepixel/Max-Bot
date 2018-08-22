const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Temp Welcome Message
const welcomeMessage = '__**Welcome to the official Full Sail University Armada Discord!**__ \nArmada houses Full Sail University’s official esports teams and gaming communities. Our mission is to unite our school through gaming and esports, igniting the pride that only those who call Full Sail home will know.\nTo get started, we’d love to introduce our bot, @max! Max can help you to assign yourself different roles dependent upon the gaming communities that you would like to participate in. Please first head to our #bot - spam channel to verify your active student status and assign yourself roles. You can do this by typing “!verify yourstudentemail@student.fullsail.edu” - but make sure to use your actual student email. Max will take it from there!\n\nYour Armada Staff Advisors are:\nHoyt Dingus @[Full Sail Armada]MuaDeeb\n\nPlease reach out to our Officers for any questions and concerns, and they can escalate to our Staff Advisors if necessary.\n\nFollow our social channels:\nFacebook: https://www.facebook.com/FullSailArmada/\nTwitter: https://twitter.com/fullsailarmada\nTwitch: https://www.twitch.tv/fullsailarmada\n\nOur Armada Code of Conduct can be found here: https://docs.google.com/document/d/13WZqhZ9SgctEw83SqkKadSgobxPjYkk35B1OGuDx7A8/edit?usp=sharing';

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});

client.on('guildMemberAdd', (memberAddEvent) => {
  util.log('~I have sensed a disturbance in the force, a new user is here.', memberAddEvent.user, 0);
  memberAddEvent.user.sendMessage(welcomeMessage);
});

client.on('guildMemberRemove', (memberRemoveEvent) => {
  util.log('~A user has disappeared into the vapor.', memberRemoveEvent.user, 0);
});

// Listen for messages
client.on('message', (message) => {
  // Check for ! prefix on message to ensure it is a command
  if (message.content.charAt(0) === '!') {
    util.log('Command message received', message.content, 0);

    // Build basic help string
    let helpString = 'v1.5.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**';

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

client.login(process.env.TOKEN);
