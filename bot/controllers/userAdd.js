const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

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
    return `Welcome to the server ${userMsg.author.username}`;
  }
}
module.exports = UserAdd;
