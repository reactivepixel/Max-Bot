const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const { generateCode, isAdmin } = require('../botUtils.js');
const { fetch } = require('node-fetch');
const Discord = require('discord.js');
const hbs = require('nodemailer-express-handlebars');

const client = new Discord.Client();

class MessageController extends BaseController {
  constructor(eventObj) {
    // Call BaseController constructor
    super(eventObj);

    this.eventName = 'message';
    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!help',
        '!help',
        'Shows List of Commands',
        'Shows a list of all available commands in the discord bot',
        this.showCommandsAction.bind(controller),
      ),
      new Command(
        '!verify',
        '!verify <email_address>',
        'Verify Email Address',
        'Verify your Full Sail email address. Must be @student.fullsail.edu or @fullsail.com.',
        this.verifyAction.bind(controller),
      ),
      new Command(
        '!roles',
        '!roles',
        'List All Roles',
        'List all available Armada roles.',
        this.rolesAction.bind(controller),
        'dm',
      ),
      new Command(
        '!addRole',
        '!addRole <role_name>',
        'Add Role',
        'Add a single role to yourself. Role is case-sensitive.',
        this.addRoleAction.bind(controller),
      ),
      new Command(
        '!addRoles',
        '!addRoles <role_name>,[role_name]',
        'Add Multiple Roles',
        'Add multiple roles to yourself. Rolea are case-sensitive.',
        this.addRolesAction.bind(controller),
      ),
      new Command(
        '!removeRole',
        '!removeRole <role_name>',
        'Remove Role',
        'Remove a single role from yourself. Role is case-sensitive.',
        this.removeRoleAction.bind(controller),
      ),
      new Command(
        '!addAllRoles',
        '!addAllRoles',
        'Add All Roles',
        'Add every game role to yourself.',
        this.addAllRolesAction.bind(controller),
      ),
      new Command(
        '!removeAllRoles',
        '!removeAllRoles',
        'Remove All Roles',
        'Remove every game role from yourself.',
        this.removeAllRolesAction.bind(controller),
      ),
      new Command(
        '!channels',
        '!channels',
        'List All Channels',
        'List all available Armada channels.',
        this.channelsAction.bind(controller),
        'dm',
      ),
      new Command(
        '!announce',
        '!announce <channel_name>,[channel_name] <message>',
        'Announce To Channels',
        'Broadcast to multiple channels. Channels are case-sensitive.',
        this.announceAction.bind(controller),
        'reply',
        true,
      ),
      new Command(
        '!poll',
        '!poll <ask-a-question> <option_1> <option_2> <option_3>',
        'Post a Poll users can vote on',
        'Post a Poll users can vote on, use "-" to separate words in your question',
        this.pollAction.bind(controller),
      ),
      new Command(
        '!question',
        '!question <ask-a-question>',
        'Post a Question users can vote on',
        'Post a Question users can vote on, use "-" to separate words in your question',
        this.pollAction.bind(controller),
      ),
      new Command(
        '!8ball',
        '!8ball <question>',
        'Shakes 8 Ball',
        'Ask the 8ball a question and get the answer you have always seeked',
        this.magic8ballAction.bind(controller),
      ),
      new Command(
        '!coinFlip',
        '!coinFlip',
        'Flip Coin',
        'Flip a coin.',
        this.coinFlipAction.bind(controller),
      ),
      new Command(
        '!rollDice',
        '!rollDice <sides_of_the_dice>',
        'Roll Dice',
        'Roll a dice with sides of your choosing.',
        this.rollDiceAction.bind(controller),
      ),
      new Command(
        '!dadJoke',
        '!dadJoke',
        'Dad Joke',
        'Get a random dad joke.',
        this.dadJokeAction.bind(controller),
      ),
    ];

    // User roles commands cannot change
    this.disallowedRoles = [
      'admin', 'armada officers', 'armada officer',
      'moderator', 'privateers', 'privateer',
      'tester', 'crew', 'fleet officer', '@everyone',
    ];
  }

  // Display a list of all available commands to the user
  showCommandsAction() {
    const { eventObj } = this;
    let helpString = 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**';
    // Loop through commands if help command and add to string
    this.commands.forEach((command) => {
      if (command.showWithHelp) {
        if (command.adminOnly && isAdmin(eventObj.member)) {
          helpString += `\n\n \`${command.example}\` **- Admin Only** \n\t ${command.description}`;
        } else if (command.adminOnly && !isAdmin(eventObj.member)) {
          helpString += '';
        } else {
          helpString += `\n\n \`${command.example}\` \n\t ${command.description}`;
        }
      }
    });
    return helpString;
  }

  // Lists all roles
  rolesAction() {
    const { eventObj, disallowedRoles } = this;
    const roles = [];
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return roles.push(role.name);
      }
      return role.name;
    });
    return 'List of all Armada Roles: \n\n' + roles.join('\n');
  }

  // Adds a role to the user
  addRoleAction() {
    const { eventObj, disallowedRoles } = this;
    const targetRole = eventObj.guild.roles.find('name', eventObj.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', eventObj.parsed[1], 2);
      return '"' + eventObj.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You are not worthy of the role ' + eventObj.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      eventObj.member.addRole(targetRole).catch(util.log);
      return 'Added the role "' + targetRole.name + '".';
    }
  }

  // Adds multiple roles to the user
  addRolesAction() {
    const { eventObj, disallowedRoles } = this;
    const roles = eventObj.parsed[1].split(',');
    util.log('Multiple Roles Parsing', roles, 4);

    roles.map((role) => {
      if (!disallowedRoles.includes(role.toLowerCase())) {
        const targetRole = eventObj.guild.roles.find('name', role);
        util.log('Asking API for Role', targetRole, 4);

        if (targetRole === null) {
          return '"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
        }
        return eventObj.member.addRole(targetRole).catch(util.log);
      }
      return role.name;
    });

    return 'All set!';
  }

  // Removes role from user
  removeRoleAction() {
    const { eventObj, disallowedRoles } = this;
    const targetRole = eventObj.guild.roles.find('name', eventObj.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', eventObj.parsed[1], 2);
      return '"' + eventObj.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    }
    if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You have not the power or the will to control this power.';
    }

    util.log('Removing role from user', targetRole.name, 2);
    eventObj.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + ' removed.';
  }

  // Adds all roles to user
  addAllRolesAction() {
    const { eventObj, disallowedRoles } = this;
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return eventObj.member.addRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
  }

  // Removes all roles from user
  removeAllRolesAction() {
    const { eventObj, disallowedRoles } = this;
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return eventObj.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Removing all roles. Back to basics.';
  }

  channelsAction() {
    const { eventObj } = this;
    const channels = [];
    eventObj.guild.channels.map(channel => channels.push(channel.name));
    return 'List of all Armada Channels: \n\n' + channels.join('\n');
  }

  announceAction() {
    const { eventObj } = this;
    const channels = eventObj.parsed[1].split(',');
    util.log('Multiple Channels Parsing', channels, 4);

    channels.map((channel) => {
      const targetChannel = eventObj.guild.channels.find('name', channel);
      const sender = eventObj.author.username;
      util.log('Asking API for Channel', targetChannel, 4);

      if (targetChannel === null) {
        return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all Channels (They are case-sensitive)';
      }

      // Set parsed value to 2 for eventObj.
      let msgParsedIndex = 2;
      let preparedMessage = '';

      // Loop through/join user eventObj by space until end.
      while (msgParsedIndex < eventObj.parsed.length) {
        // Add spaces after first word
        if (msgParsedIndex !== 2) {
          preparedMessage += ' ';
        }
        preparedMessage += eventObj.parsed[msgParsedIndex];
        msgParsedIndex += 1;
      }
      return targetChannel.send(sender + ' has an announcment: ```' + preparedMessage + '```');
    });

    return 'Broadcast sent!';
  }

  // Verifies Full Sail email addresses
  verifyAction() {
    const { message } = this;
    const targetVerifiedRoleName = 'Crew';
    const validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
    const timeoutInMiliseconds = 600000;
    const email = message.parsed[1].toLowerCase();
    const emailDomain = email.split('@').pop();

    // We can set `codeLength` to whatever length we want the verify code to be.
    // Recommend ngt 8 digits.
    if (validDomains.includes(emailDomain)) {
      const codeLength = 6;
      // code to equal value generated
      const code = generateCode(codeLength);
      util.log('code', code, 3);
      // TODO: Set `time` prop to 600000 (10min)
      if (message.content === code) {
        util.log('words');
      }
      const collector = message.channel.createMessageCollector(
        m => m.content.includes(code),
        { time: timeoutInMiliseconds },
      );
      collector.on('collect', (m) => {
        client.on('message', (message) => {
          util.log(message.content);
        });
        const verifyUser = 'Welcome aboard, Crewmate!';
        const userAlreadyOnSystem = 'This email has already been verified to a discord user.';

        models.Member.findOne({ where: { email } }).then((matchedUserData) => {
          if (matchedUserData === null) {
            // no existing record found
            models.Member.create({
              discorduser: m.author.id,
              email,
              uuid: uuidv4(),
              verified: 1,
            });
            // mapping guild roles to find the crew role id
            const targetRole = message.guild.roles.find('name', targetVerifiedRoleName);
            message.member.addRole(targetRole).catch(util.log);
            message.author.send(verifyUser);
          } else {
            // existing record found
            message.author.send(userAlreadyOnSystem);
          }
        });
        util.log('Collected', m.content, 3);
      });

      collector.on('end', (collected) => {
        const verificationTimeout = `!verify timeout. Clap ${collected.author.username} in irons!  Let's see how well they dance on the plank!`;
        util.log('Items', collected.size, 3);
        if (collected.size === 0) {
          // TODO: ping admin team on verification fail
          message.author.send(verificationTimeout);
        }
      });
      const options = {
        viewPath: 'template',
        extName: '.hbs',
      };
      // Set up Nodemailer to send emails through gmail
      const sendVerifyCode = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS,
        },
      });
      // using the email template
      sendVerifyCode.use('compile', hbs(options));
      // TODO: Build email template
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Armada Verification Code',
        template: 'email',
        context: {
          code: `${code}`,
          userEmail: email,
        },
      };
        // Call sendMail on sendVerifyCode
        // Pass mailOptions & callback function
      sendVerifyCode.sendMail(mailOptions, (err, info) => {
        const errorMsg = 'Oops, looks like the email can not be sent. It\'s not you, it\'s me. Please reach out to a moderator to help you verify.';
        if (err) {
          message.author.send(errorMsg);
          util.log('Email not sent', err, 3);
        } else {
          util.log('Email details', info, 3);
        }
      });

      util.log('Code', code, 3);
      return `...What's the passcode? \n\n *eyes you suspicously*\n\n I just sent it to your email, just respond back to this channel within ${(timeoutInMiliseconds / 1000) / 60} minutes, with the code, and I won't treat you like a scurvy cur! Make sure to check your spam folder if you cannot find the email!`;
    } else {
      return 'Sorry, I can only verify Full Sail University email addresses.';
    }
  }

  pollAction() {
    const { eventObj } = this;
    const question = eventObj.parsed[1];
    const questionSpaced = question.split('-').join(' ');
    const { content } = eventObj;
    const count = content.split(' ').length;

    let options = '';

    if (count >= 2 && count <= 11) {
      for (let i = 2; i < count; i += 1) {
        if (i === 2) {
          options += `\r \u0031\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 3) {
          options += `\r \u0032\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 4) {
          options += `\r \u0033\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 5) {
          options += `\r \u0034\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 6) {
          options += `\r \u0035\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 7) {
          options += `\r \u0036\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 8) {
          options += `\r \u0037\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 9) {
          options += `\r \u0038\u20E3 ${eventObj.parsed[i]}`;
        } else if (i === 10) {
          options += `\r ️\u0039\u20E3 ${eventObj.parsed[i]}`;
        }
      }
    } else {
      return 'The poll can not expect 0 or more than 9 options';
    }

    const query = `"${questionSpaced}" \r ${options}`;
    eventObj.channel
      .send(query)
      .then((eventObj) => {
        for (let i = 2; i < count; i += 1) {
          if (i === 2) {
            eventObj.react('\u0031\u20E3');
          } else if (i === 3) {
            eventObj.react('\u0032\u20E3');
          } else if (i === 4) {
            eventObj.react('\u0033\u20E3');
          } else if (i === 5) {
            eventObj.react('\u0034\u20E3');
          } else if (i === 6) {
            eventObj.react('\u0035\u20E3');
          } else if (i === 7) {
            eventObj.react('\u0036\u20E3');
          } else if (i === 8) {
            eventObj.react('\u0037\u20E3');
          } else if (i === 9) {
            eventObj.react('\u0038\u20E3');
          } else if (i === 10) {
            eventObj.react('\u0039\u20E3');
          }
        }
      })
      .catch(() => {
        util.error('pollAction reaction failed');
      });
    return ' wants to know.';
  }

  questionsAction() {
    const { eventObj } = this;
    const question = eventObj.parsed[1];
    const query = `"${question.split('-').join(' ')}?"`;
    eventObj.channel.send(query)
      .then((eventObj) => {
        eventObj.react('👍');
        eventObj.react('🤔');
        eventObj.react('👎');
      }).catch(() => {
        util.error('questionAction reaction failed');
      });
    return ' wants to know.';
  }
  // Shakes the 8 ball
  magic8ballAction() {
    const { eventObj } = this;
    // this is all of the responses the magic 8 ball can give
    const answers = [
      'It is certian',
      'It is decidedly so',
      'Without a doubt',
      'Yes definitely',
      'You may rely on it',
      'You can count on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Absolutely',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      'Don\'t count on it',
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful',
      'Chances aren\'t good',
    ];
    const shake = Math.floor(Math.random() * answers.length);
    return eventObj.author.username + ' shakes the 8 ball and gets: ```' + answers[shake] + '```';
  }
  // Flip the coin
  coinFlipAction() {
    const { eventObj } = this;
    const flip = Math.floor(Math.random() * 2);
    if (flip === 0) {
      return `You just flipped HEADS! Way to go ${eventObj.author.username}`;
    } else {
      return `You just flipped TAILS!! Way to go ${eventObj.author.username}`;
    }
  }
  // rolls the dice with the user set sides
  rollDiceAction() {
    const { eventObj } = this;
    const sides = eventObj.parsed[1];
    const roll = Math.floor(Math.random() * sides) + 1;
    if (!isNaN(sides)) {
      return `Look at that. ${eventObj.author.username} just rolled a ${roll}`;
    } else {
      return `Sorry ${eventObj.author.username}, It looks like you didn't enter a number.`;
    }
  }
  // makes a simple API request to icanhazdadjoke.com for a random dad joke
  dadJokeAction() {
    const { eventObj } = this;
    // this holds the url for the api get request
    const options = {
      method: 'GET',
      headers: {
        accept: 'text/plain',
      },
    };
    fetch('https://icanhazdadjoke.com/', options)
      .then(res => res.text())
      .then(body => eventObj.channel.send(`Here is your joke ${eventObj.author.username}!! ${body}`));
    return 'Want to hear a joke?';
  }
}

module.exports = MessageController;
