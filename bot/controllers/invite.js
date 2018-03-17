const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const { getUserPointsandUpdate, sendEmail } = require('../botUtils');


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
    const validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
    const email = message.parsed[1].toLowerCase();
    const emailDomain = email.split('@').pop();
    // create the invite for the channel
    message.channel.createInvite().then((invite, err) => {
      if (err)util.log('create invite err : ', err, 3);

      if (validDomains.includes(emailDomain)) {
        const emailType = 'invite';
        const emailSubject = 'Armada Invite';
        const emailBodyString = `<table><tr><td><p>Please follow this link to be included in the discord <a href=${invite.url}>link</a> Thank you for your interest for wanting to be in the Discord enjoy.</p></td></tr></table>`;
        sendEmail(message, email, emailSubject, emailBodyString, emailType, (sendStatus) => {
          if (sendStatus) {
            const numPointToAdd = 1;
            getUserPointsandUpdate(message.author.id, numPointToAdd);
          }
        });
      } else {
        message.author.send('Sorry the invite could not be sent please contact a admin for assistance');
      }
    });
    return 'You have received 1 point';
  }
}

module.exports = inviteController;
