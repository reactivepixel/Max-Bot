const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class UserAdd extends BaseController {
  constructor(message) {
    super(message);

    const controller = this;

    this.commands = [
      new Command(
        '!resend',
        '!resend',
        'Resend Message',
        'Send Message',
        this.sendMessage.bind(controller),
        'dm',

      ),
    ];
  }
  sendMessage() {
    const { userMsg } = this;
    if (userMsg !== null) {
      return `Welcome to the server ${userMsg.author.username}`;
    }
    return 'Oops';
  }
}
module.exports = UserAdd;
