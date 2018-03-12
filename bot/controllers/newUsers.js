const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class newUserController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!welcome',
        '!welcome',
        'Welcome Message',
        'Sends a new user of the channel the welcome message',
        this.msgNewUserWelcome.bind(controller),
        'dm',
      ),
    ];
  }

  msgNewUserWelcome() {
    const { message } = this;
    return `${message.author.username}, Welcome to the channel`;
  }
}
module.exports = newUserController;
