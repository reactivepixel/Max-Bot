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
        'Resend the welcome message you recieved when you joined the server.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  welcomeAction() {
    const { message } = this;
    return `Welcome to the server, ${message.server}`;
  }
}

module.exports = WelcomeController;
