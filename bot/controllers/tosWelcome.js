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
        'Resend Terms',
        'Send Terms Copy',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }
  // Sends the welcome message to the user
  welcomeAction() {
    const { message } = this;
    return `Welcome ${message.author.username} to the server! Please read our Terms of Service. If you want to receive the terms again just type !tos`;
  }
}
module.exports = TosController;
