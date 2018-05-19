const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const Discord = require('discord.js');
const fs = require('fs');
const HandleBars = require('handlebars');
const hbs = require('nodemailer-express-handlebars');
const emailTemp = require('../../template/email.hbs');
const path = require('path');

const client = new Discord.Client();

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
        'Verify your Full Sail email address. Must be @student.fullsail.edu or @fullsail.com.',
        this.verifyAction.bind(controller),
        'dm',
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
        { time: timeoutInMiliseconds });
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
      // const source = fs.readFileSync(path.join
      // (__dirname, '../../ template/email.hbs'), 'utf8');
      // const template = HandleBars.compile(source);
      sendVerifyCode.use('compile', hbs(options));
      // TODO: Build email template
      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Armada Verification Code',
        template: 'email',
        context: {
          code: `${code}`,
          email: email,
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
}
module.exports = VerifyController;
