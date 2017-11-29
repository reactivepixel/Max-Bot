const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const util = require('apex-util');
const nodemailer = require('nodemailer');

// Method to generate random numeric verification code
// Modified to fit style guide from this SO answer:
// https://stackoverflow.com/a/39774334
const generateCode = (n) => {
  // Workaround method for Math.pow() and ** operator
  const pow = (base, exp) => {
    let result = 1;
    for (let i = 0; i < exp; i += 1) {
      result *= base;
    }
    return result;
  };
  const add = 1;
  let max = 12 - add;
  let min = 0;
  if (n > max) {
    return generateCode(max) + generateCode(n - max);
  }
  max = pow(10, n + add);
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
        const targetVerifiedRoleName = 'Crew';
        const validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
        const timeoutInMiliseconds = 600000;
        const email = msg.parsed[1].toLowerCase();
        const emailDomain = email.split('@').pop();
        // We can set `codeLength` to whatever length we want the verif code to be.
        // Recommend ngt 8 digits.
        if (validDomains.includes(emailDomain)) {
          const codeLength = 6;
          const code = generateCode(codeLength);
          util.log('code', code, 3);
          // TODO: Set `time` prop to 600000 (10min)
          const collector = message.channel.createMessageCollector(
            m => m.content.includes(code),
            { time: timeoutInMiliseconds });
          collector.on('collect', (m) => {
            const verifyUser = 'Welcome aboard, Crewmate!';
            const userAlredyOnSystem = 'This email has already been verified to a discord user.';
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
                message.reply(verifyUser);
              } else {
                // existing record found
                message.reply(userAlredyOnSystem);
              }
            });
            util.log('Collected', m.content, 3);
          });
          collector.on('end', (collected) => {
            const verificationTimeout = `!verify timeout. Clap ${collected.author.username} in irons!  Let's see how well they dance on the plank!`;
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
            from: process.env.EMAIL_USERNAME,
            to: email,
            subject: 'Armada Verification Code',
            html: `<table><tr><td><p>Enter the code below into Discord, in the same channel on the Armada Server. Verification will timeout after ${(timeoutInMiliseconds / 1000) / 60} minutes from first entering the !verify command.</p></td></tr><tr><td><h2>Verification Code: ${code}</h2></td></tr></table>`,
          };
          // Call sendMail on sendVerifyCode
          // Pass mailOptions & callback function
          sendVerifyCode.sendMail(mailOptions, (err, info) => {
            const errorMsg = 'Oops, looks like the email can not be sent. It\'s not you, it\'s me. Please reach out to a moderator to help you verify.';
            if (err) {
              message.reply(errorMsg);
              util.log('Email not sent', err, 3);
            } else {
              util.log('Email details', info, 3);
            }
          });

          util.log('Code', code, 3);
          return `...What's the passcode? \n\n *eyes you suspicously*\n\n I just sent it to your email, just respond back to this channel within ${(timeoutInMiliseconds / 1000) / 60} minutes, with the code, and I won't treat you like a scurvy cur!`;
        } else {
          return 'Sorry, I can only verify Full Sail University email addresses.';
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
