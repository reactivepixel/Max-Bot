const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class Welcome extends BaseController {
  constructor(message) {
    super(message);

    const controller = this;
    this.commands = [
      new Command(
        '!resend',
        '!resend',
        'Resend Welcome Message',
        'Resend Welcome Message',
        this.sendMessage.bind(controller),
        'dm',

      ),
    ];
  }
  sendMessage() {
    const { userMsg } = this;
    return `Welcome ${userMsg.author.id} to the server.`;
  }
}
module.exports = Welcome;
