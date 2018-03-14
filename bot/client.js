const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');
const { Member } = require('../db/models');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Function to add points for chatting
const awardPointsforChatting = async (message) => {
  const { content, channel, author } = message;
  if (channel.type !== 'dm' && content.length >= 5) {
    const messagesPoints = 0.2;
    // SQL select statement
    const memberData = await Member.findAll({
      attributes: ['messagesCount', 'points', 'verified'],
      where: { discordUser: author.id },
    });
    await util.log('Member data from SQL call', memberData[0].dataValues, 4);
    let { messagesCount, points } = memberData[0].dataValues;
    const { verified } = memberData[0].dataValues;
    messagesCount += 1;
    points += messagesPoints;
    if (verified) {
      await Member.update(
        { messagesCount, points: parseFloat(points.toFixed(2)) },
        { where: { discordUser: author.id } },
      ).then((updatedRows) => {
        util.log('Updated Result', updatedRows, 4);
      });
    }
  }
};

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
  } else {
    // Award points if the message isn't a command
    awardPointsforChatting(message);
  }
});

client.login(process.env.TOKEN);
