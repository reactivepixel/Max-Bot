const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const { getUserPointsandUpdate, sendEmail, validDomains } = require('../botUtils');

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
        'Receive one bonus point for every Full Sail student you invite that can be verified.',
        this.inviteAction.bind(controller),
        'dm',
      ),
    ];
  }
  // this message will be sent to the user's dm with their username
  inviteAction() {
    const { message } = this;
    const email = message.parsed[1].toLowerCase();
    const invitePointsAwarded = 1;
    const emailDomain = email.split('@').pop();
    const filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

    // create the invite for the channel
    message.channel.createInvite().then((invite, err) => {
      if (err)util.log('create invite err : ', err, 3);
      // Test to see if the email exists
      if (!filter.test(email)) {
        // Send user message if the email is not correct
        message.author.send('Please provide a valid email address');
      }

      if (validDomains.includes(emailDomain)) {
        const emailType = 'invite';
        const emailSubject = 'Armada Invite';
        const emailBodyString = `<table><tr><td><p>Please follow this link to be included in the discord <a href=${invite.url}>link</a> Thank you for your interest for wanting to be in the Discord enjoy.</p></td></tr></table>`;
        sendEmail(message, email, emailSubject, emailBodyString, emailType, (sendStatus) => {
          if (sendStatus) {
            getUserPointsandUpdate(message.author.id, invitePointsAwarded);
            message.author.send(`You've received ${invitePointsAwarded} point(s) for sending this invite.`);
          }
        });
      } else {
        message.author.send('Sorry the invite could not be sent please contact a admin for assistance.');
      }
    });
    return `${message.author}, invite status:`;
  }
}

module.exports = inviteController;
