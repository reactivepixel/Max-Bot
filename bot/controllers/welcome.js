const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const { welcomeUser } = require('../botUtils.js');

class WelcomeController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!welcome',
        '!welcome',
        'Resend Welcome Message',
        'Resends The Direct Welcome Message.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  // Sends the welcome message to the user
  welcomeAction() {
    const { message } = this;
    util.log('Sending Welcome Message to User', 3);
    return welcomeUser(message.author.id);
  }
}

module.exports = WelcomeController;
