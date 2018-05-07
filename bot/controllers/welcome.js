const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class WelcomeController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!welcome',
        '!welcome',
        'Welcome Message',
        'Replays welcome message.',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }
  welcomeAction() {
    const { message } = this;
    return `${message.author.username}, Welcome to the Full Sail Armada! These are the terms of service...`;
  }
}
module.exports = WelcomeController;
