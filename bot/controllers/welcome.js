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
        'Welcome Message',
        'Replay welcome message recieved when you join the server.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  welcomeAction() {
    const { message } = this;
    return `${message.author.username}, test!`;
  }
}

module.exports = WelcomeController;
