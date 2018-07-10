const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class WelcomeController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!resendWelcomeMessage',
        '!resendWelcomeMessage',
        'Resend Welcome Message DM',
        'Resend the welcome message you received from the bot when you first joined the server.',
        this.resendWelcomeMessage.bind(controller),
        'dm',
      ),
    ];
  }

  resendWelcomeMessage() {
    const { message } = this;
    message.member.send(`Welcome to our server ${message.member}!`);
    return 'Done.';
  }
}

module.exports = WelcomeController;
