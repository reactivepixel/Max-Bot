const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class TosController extends BaseController {
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
        'Send Copy of the Terms of Service',
        this.tosAction.bind(controller),
        'dm',
      ),
    ];
  }

  tosAction() {
    // Send Direct Message with the Terms of Service
    const { message } = this;
    return `${message.author.username} read our Terms of service`;
  }
}
module.exports = TosController;
