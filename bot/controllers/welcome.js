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
        '!tos',
        '!tos',
        'Terms of Service',
        'Resends terms of service message.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  // Send direct message to user
  welcomeAction() {
    const { message } = this;
    const directMsg = `<@${message.author.id}>, Welcome to the Full Sail Armada! These are the terms of service...`;
    return directMsg;
  }
}
module.exports = WelcomeController;
