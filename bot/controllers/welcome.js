const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

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
        'Send Welcome Message',
        'Sends A Direct Welcome Message.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  // Sends the welcome message to the user
  welcomeAction() {
    const { message } = this;
    if (message) {
      util.log('Sending Welcome Message to User', 0);
      return 'Welcome to the server! Please read our Terms of Service below to get started: \n\n --Terms of Service--';
    }
    return 'Hmm, it seems something went missing! Please try requesting the welcome message again.';
  }
}

module.exports = WelcomeController;
