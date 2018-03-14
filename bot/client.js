const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');
const models = require('../db/models');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

const awardBonusPoints = async (user) => {
    const numberOfMessagesForBonus = 1000;
     // Get User Message Count
     // Get User Message Count
    const memberData = await models.Member.findAll(
      {
        attributes: ['messagesCount', 'points'],
        where: { discordUser: user },
      },
    );
    let { messagesCount } = memberData[0].dataValues;
    let { points } = memberData[0].dataValues;
  util.log('Results from database call', memberData[0].dataValues, 4);
   // Check if its greater or equal to numberOfMessagesForBonus
   // Check if its greater or equal to numberOfMessagesForBonus
-  util.log('User: ', user, 0);
  if (messagesCount >= numberOfMessagesForBonus) {
    points += 5;
    messagesCount = 0;
}
  // Update member information
  // await models.Member.update(
  //   { messagesCount: 3424242 },
  //   { where: { discordUser: user } },
  // ).then((updatedRows) => {
  //   util.log('Updated result', updatedRows, 4);
  // });
  // util.log('User: ', user, 0);
 };
 
  

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});

// Listen for messages
client.on('message', (message) => {
  awardBonusPoints(message.author.id);
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

client.login(process.env.TOKEN);
