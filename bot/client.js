const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');
const { Member } = require('../db/models');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Alert when ready
client.on('ready', () => {
  util.log('Bot Online and Ready', 0);
});
// Award bonus points
const awardBonusPoints = (dataValues) => {
  // Deconstruct the variable for easy reading
  const { messagesCount } = dataValues;
  const amountOfBonusPoints = 100;
  const messagseCountString = (messagesCount + 1).toString();
  // Slice the messages string to get certain characters
  const messagesFirstChar = parseInt(messagseCountString.slice(0, 1), 10);
  const messagesLastThreeChar = messagseCountString.slice(-3);
  const messagesCountLength = !!(messagseCountString.length >= 4 || messagesLastThreeChar === '000');
  return messagesCountLength ? messagesFirstChar * amountOfBonusPoints : 0;
};
// All the logic to determine if they are awarded points
const awardMessageSendPoints = async (message) => {
  const { channel, content } = message;
  if (channel.type !== 'dm' && content.length >= 5) {
    // Call the function to get the data
    const memberData = await Member.findAll(
      {
        attributes: ['messagesCount', 'points', 'verified'],
        where: { discordUser: message.author.id },
      },
    );
    util.log('Results from database call', memberData[0].dataValues, 4);
    // Grab the bonus points from the function
    const bonusPoints = awardBonusPoints(memberData[0].dataValues);
    let { messagesCount, points } = memberData[0].dataValues;
    const { verified } = memberData[0].dataValues;
    // Update the messagesCount and points
    messagesCount += 1;
    points = Math.floor(messagesCount / 5) + bonusPoints; // ~~ is the same as Math.floor()
    if (verified) {
      await Member.update(
        { messagesCount, points },
        { where: { discordUser: message.author.id } },
      ).then((updatedRows) => {
        util.log('Updated result', updatedRows, 4);
      });
    }
  }
};
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
    // Award points for messages not related to commands
    awardMessageSendPoints(message);
    // awardBonusPoints(message);
  }
});

client.on('guildMemberAdd', (member) => {
  member.sendMessage('Welcome to the channel!');
});

// controllers.newUserController();
client.login(process.env.TOKEN);
