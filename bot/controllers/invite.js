const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const nodemailer = require('nodemailer');
const util = require('apex-util');
const { getUserPointsandUpdate } = require('../botUtils');


class inviteController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!invite',
        '!invite <email_address>',
        'invite Message',
        'Resend the welcome message you recieved when you joined the server.',
        this.inviteAction.bind(controller),
        'dm',
      ),
    ];
  }
  // this message will be sent to the user's dm with their username
  inviteAction() {
    const { message } = this;
    const validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
    // let functionDone = '';
    const email = message.parsed[1].toLowerCase();
    const emailDomain = email.split('@').pop();
    message.channel.createInvite().then((invite, err) => {
      if (err)util.log('create invite err : ', err, 3);

      if (validDomains.includes(emailDomain)) {
        // Set up Nodemailer to send emails through gmail
        const sendInvite = nodemailer.createTransport({
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
          subject: 'Armada Invite',
          html: `<table><tr><td><p>Please follow this link to be included in the discord <a href=${invite.url}>link</a> Thank you for your interest for wanting to be in the Discord enjoy.</p></td></tr></table>`,
        };
        // Call sendMail on sendInvite
        // Pass mailOptions & callback function
        sendInvite.sendMail(mailOptions, (err, info) => {
          const errorMsg = 'Oops, looks like the email can not be sent. It\'s not you, it\'s me. Please reach out to a moderator to help you send a invite.';
          if (err) {
            message.reply(errorMsg);
            util.log('Email not sent', err, 3);
          } else {
            util.log('Email details', info, 3);
            getUserPointsandUpdate(message.author.id, 2);
            message.author.send('you have sent the invite');
            return 'you have sent the invite';
          }
        });
      } else {
        return 'Sorry, I can only invite Full Sail University email addresses.';
      }
    });
    if(!functionDone) return functionDone;
    // return ' heloo';
    // }
    // inviteLink();
    // return `Hey ${message.author} you have sent the email.`;
  }
}

module.exports = inviteController;
