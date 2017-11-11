const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const util = require('apex-util');
const nodemailer = require('nodemailer');

// Method to generate random numeric verification code
// Modified to fit style guide from this SO answer:
// https://stackoverflow.com/a/39774334
const generateCode = (n) => {
  const add = 1;
  let max = 12 - add;
  let min = 0;
  if (n > max) {
    return generateCode(max) + generateCode(n - max);
  }
  max = 10000000;
  min = max / 10;
  const number = Math.floor(Math.random() * (max - (min + 1))) + min;
  return ('' + number).substring(add);
};

module.exports = () => {
  const _run = (message) => {
    const ctrls = [{
      cmd: '!verify',
      example: '!verify <email_address>',
      title: 'Verify Email Address',
      desc: 'Verify user\'s email address',
      showWithHelp: true,
      posTargetUser: null,
      posSecondaryCmd: null,
      regexSplitCharacter: null,
      allowInDM: false,
      resType: 'reply',
      action: (message, ctrl, msg) => {
        const validDomains = ['student.fullsail.edu', 'fullsail.edu'];
        const email = msg.parsed[1].toLowerCase();
        const emailDomain = email.split('@').pop();
        // We can set `codeLength` to whatever length we want the verif code to be.
        // Recommend ngt 8 digits.
        if (validDomains.includes(emailDomain)) {
          const codeLength = 6;
          const code = generateCode(codeLength);
          // TODO: Set `time` prop to 600000 (10min)
          const collector = message.channel.createMessageCollector(
            m => m.content.includes(code),
            // 15000ms only for testing!!!
            { time: 150000 });
          collector.on('collect', (m) => {
            const verifyUser = `Thanks, ${message.author.username}! I'll get to work adding you the servers right away!`;
            const userAlredyOnSystem = `the user ${message.author.username} is already in our system!`;
            models.Member.findOne({ where: { email } }).then((data) => {
              if (data === null) {
                // no existing record found
                models.Member.create({
                  discorduser: m.author.username,
                  email,
                  uuid: uuidv4(),
                  verified: 1,
                }).then(util.log).catch(util.error);
                message.reply(verifyUser);
              } else {
                // existing record found
                message.reply(userAlredyOnSystem);
              }
            });
            util.log('Collected', m.content, 3);
          });
          collector.on('end', (collected) => {
            const verificationTimeout = 'Uh-oh, it looks like you weren\'t able to get the right verification code back to me in time. I\'ve contacted the Armada admins so we can get this straightened out right away.';
            util.log('Items', collected.size, 3);
            if (collected.size === 0) {
              // TODO: ping admin team on verification fail
              message.reply(verificationTimeout);
            }
          });
          // Set up Nodemailer to send emails through gmail
          const sendVerifyCode = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USERNAME,
              pass: process.env.EMAIL_PASS,
            },
          });
          // Nodemailer email recipient & message
          // TODO: Build email template
          const mailOptions = {
            from: 'discord.maxbot@gmail.com',
            to: email,
            subject: 'Armada Verification Code',
            html: `<p>Verification Code: ${code}</p>`,
          };
          // Call sendMail on sendVerifyCode
          // Pass mailOptions & callback function
          sendVerifyCode.sendMail(mailOptions, (err, info) => {
            const errorMsg = 'Oops, looks like the email can not be sent. Its not you, its me.. Please contact a moderator and let them know I have failed.';
            if (err) {
              message.reply(errorMsg);
              util.log('Email not sent', err, 3);
            } else {
              util.log('Email details', info, 3);
            }
          });

          util.log('Code', code, 3);
          return `Hi there, ${message.author.username}, it looks like you're trying to verify your email address!\n\nBeep boop... generating verification code... beep boop\n\nI've emailed a ${codeLength}-digit number to _${email}_. Respond back with that number within 10 minutes and I'll automagically verify your email address so you can represent the glorious Full Sail Armada!`;
        } else {
          return `Sorry, ${message.author.username}, I can only verify Full Sail University email addresses.`;
        }
      },
    }];

    const onSuccess = (message, res, ctrl) => {
      if (res !== null) {
        if (ctrl.resType === 'reply') {
          return message.reply(res);
        } else if (ctrl.resType === 'dm') {
          return message.author.send(res);
        }
      }
      // Fail Safe
      return false;
    };

    const onError = message => message.reply('I Broke... Beep...Boop...Beep');

    const messageMiddleware = (message) => {
      const container = {};
      container.parsed = message.content.split(' ');
      const msg = Object.assign(message, container);
      return msg;
    };

    ctrls.map((ctrl) => {
      util.log('Running through controller', ctrl.cmd, 2);

      const msg = messageMiddleware(message);
      if (msg.parsed[0].toLowerCase() === ctrl.cmd.toLowerCase()) {
        util.log('!!! Matched Ctrl to Cmd !!!', ctrl.cmd, 2);

        // Ensure the communication is happening on a server
        if (!ctrl.allowInDM) {
          if (!message.guild) return onError(message, 'Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
        }

        // Do Stuff
        const res = ctrl.action(message, ctrl, msg);
        if (res) {
          onSuccess(message, res, ctrl);
        } else {
          onError(message, res, ctrl);
        }
      }
      return ctrl;
    });
  };

  return {
    run: _run,
  };
};
