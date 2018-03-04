const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
// const util = require('apex-util');

class WelcomeMessageController extends BaseController {
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
        'Welcome Message',
        'Send the welcome message again',
        this.rolesAction.bind(controller),
        'dm',
      ),
    ];
  }

  // Lists all roles
  rolesAction() {
    const { message } = this;
    return `Welcome to the server, ${message.author.username}. Enjoy your stay!`;
  }
}

module.exports = WelcomeMessageController;
