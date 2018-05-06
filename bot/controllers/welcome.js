const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

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

  // Sends a direct welcome message to the new user
  welcomeAction() {
    const { message } = this;
    if (message) {
      return 'This is test';
    }
    return 'No No';
  }
}

module.exports = WelcomeController;
