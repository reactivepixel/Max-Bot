const Discord = require('discord.js');
const util = require('apex-util');
const { isAdmin, getUserPointsandUpdate, welcomeCommand } = require('./botUtils.js');
const { Member } = require('../db/models');

// If production server, set default debug mode to production setting
if (process.env.NODE_ENV === 'production' && !process.env.DEBUG_MODE) process.env.DEBUG_MODE = 0;

const client = new Discord.Client();

// Pre-load controllers
const controllers = require('./controllers')();

// Award bonus points when user reaches every 1000 messages
const awardBonusPoints = (message, messagesCount, currentPoints) => {
  const amountOfBonusPoints = 100;
  let points = 0;
  const messagesCountTemp = messagesCount.toString().slice(-3);
  // Check if its greater or equal to numberOfMessagesForBonus
  messagesCountTemp === '000' ? points = currentPoints + amountOfBonusPoints : null;
  return points;
};

// Function to add points for chatting
const awardPointsforChatting = async (message) => {
  const { content, channel, author } = message;
  if (channel.type !== 'dm' && content.length >= 5) {
    const messagesPoints = 0.2;
    const memberData = await Member.findAll({
      attributes: ['messagesCount', 'points', 'verified'],
      where: { discordUser: author.id },
    });
    let { messagesCount, points } = memberData[0].dataValues;
    const { verified } = memberData[0].dataValues;
    messagesCount += 1;
    const bonusPoints = awardBonusPoints(message, messagesCount, points);
    points += (messagesPoints + bonusPoints);
    if (verified) {
      Member.update(
        { messagesCount, points: parseFloat(points.toFixed(2)) },
        { where: { discordUser: author.id } },
      );
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

// When user plays, streams, or Listens give 5 points
// oldMember is required due to documentation
client.on('presenceUpdate', (oldMember) => {
  const { id } = oldMember.user;
  const { game } = oldMember.presence;
  !game ? getUserPointsandUpdate(id, 5) : null;
  util.log('Game presence', game, 4);
});

// Function to send the welcome message for a new user
client.on('guildMemberAdd', (member) => {
  member.send(welcomeCommand(member));
});

client.login(process.env.TOKEN);
