const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class WelcomeController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!resendWelcome',
        '!resendWelcome',
        'Resend Welcome Message',
        'Sends a direct message to the user with the original welcome message.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  welcomeAction() {
    const { message } = this;
    return message.member.send(`Welcome to the server ${message.member}!\r\nYou can view the terms here!`);
  }
}
module.exports = WelcomeController;
