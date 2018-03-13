const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');
const models = require('../db/models');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Award bonus points
const awardBonusPoints = async (user) => {
  const amountOfBonusPoints = 100;
  // Get User Message Count
  const memberData = await models.Member.findAll(
    {
      attributes: ['messagesCount', 'points'],
      where: { discordUser: user.author.id },
    },
  );
  const messagesCountTemp = memberData[0].dataValues.messagesCount.toString().slice(-3);
  let { points } = memberData[0].dataValues;
  util.log('Results from database call', memberData[0].dataValues, 4);
  // Check if its greater or equal to numberOfMessagesForBonus
  if (messagesCountTemp === '000') {
    points += amountOfBonusPoints;
    // Update member information
    await models.Member.update(
      { points },
      { where: { discordUser: user.author.id } },
    );
  }
};

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});
// Function for the select the points and messagesCount from the database
const getPointsAndMessageCount = message =>
  models.Member.findAll(
    {
      attributes: ['messagesCount', 'points', 'verified'],
      where: { discordUser: message.author.id },
    },
  );
// All the logic to determine if they are awarded points
const awardMessageSendPoints = async (message) => {
  const { content, channel } = message;
  if (channel.type !== 'dm' && content.length >= 5) {
    // Call the function to get the data
    const memberData = await getPointsAndMessageCount(message);
    // Deconstruct the variable for easy reading
    const { messagesCount, verified } = memberData[0].dataValues;
    util.log('Results from database call', memberData[0].dataValues, 4);
    // Update the messagesCount and points for the user if they are verified
    if (verified) {
      await models.Member.update(
        {
          messagesCount: messagesCount + 1,
          points: Math.floor((messagesCount + 1) / 5),
        },
        { where: { discordUser: message.author.id } },
      ).then((updatedRows) => {
        util.log('Updated result', updatedRows, 4);
      });
    }
  }
};

// Listen for messages
client.on('message', (message) => {
  awardBonusPoints(message);
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
    // Award points for messages not related to commands
    awardMessageSendPoints(message);
  }
});

client.on('guildMemberAdd', (member) => {
  member.sendMessage('Welcome to the channel!');
});

// controllers.newUserController();
client.login(process.env.TOKEN);
