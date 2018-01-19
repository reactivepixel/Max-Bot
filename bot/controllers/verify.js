const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const { generateCode } = require('../botUtils.js');

class VerifyController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!verify',
        '!verify <email_address>',
        'Verify Email Address',
        'Verify user\'s email address',
        this.verifyAction.bind(controller),
      ),
    ];
  }

  // Verifies Full Sail email addresses
  verifyAction() {
    const { message } = this;
    const targetVerifiedRoleName = 'Crew';
    const validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
    const timeoutInMiliseconds = 600000;
    const email = message.parsed[1].toLowerCase();
    const emailDomain = email.split('@').pop();

    // We can set `codeLength` to whatever length we want the verif code to be.
    // Recommend ngt 8 digits.
    if (validDomains.includes(emailDomain)) {
      const codeLength = 6;
      // code to equal value generated
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
  }
}

module.exports = VerifyController;
