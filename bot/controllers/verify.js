const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const { generateCode } = require('../botUtils.js');
const msg = require('../locale/messages.json');

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
        msg.verify[process.env.LANGUAGE],
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
        const verifyUser = msg.verifyUserMsg[process.env.LANGUAGE];
        const userAlredyOnSystem = msg.userAlredyOnSystemMsg[process.env.LANGUAGE];
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
        const verificationTimeout = msg.verifyTimeoutMsgStart[process.env.LANGUAGE] + ` ${collected.author.username} ` + msg.verifyTimeoutMsgEnd[process.env.LANGUAGE];
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
        subject: msg.verifyHtmlMsgSubject[process.env.LANGUAGE],
        html: '<table><tr><td><p>' + msg.verifyHtmlMsgStart[process.env.LANGUAGE] + ` ${(timeoutInMiliseconds / 1000) / 60} ` + msg.verifyHtmlMsgEnd[process.env.LANGUAGE] + `${code}</h2></td></tr></table>`,
      };
      // Call sendMail on sendVerifyCode
      // Pass mailOptions & callback function
      sendVerifyCode.sendMail(mailOptions, (err, info) => {
        const errorMsg = msg.verifyErrorMsg[process.env.LANGUAGE];
        if (err) {
          message.reply(errorMsg);
          util.log('Email not sent', err, 3);
        } else {
          util.log('Email details', info, 3);
        }
      });

      util.log('Code', code, 3);
      return msg.verifyEmailMsgStart[process.env.LANGUAGE] + ` ${(timeoutInMiliseconds / 1000) / 60} ` + msg.verifyEmailMsgEnd[process.env.LANGUAGE];
    } else {
      return msg.verifyEmailDenied[process.env.LANGUAGE];
    }
  }
}

module.exports = VerifyController;
