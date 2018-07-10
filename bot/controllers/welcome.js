const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class WelcomeController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!terms',
        '!terms',
        'Message Terms of Service',
        'Sends a direct message to the user with the terms of service.',
        this.termsAction.bind(controller),
        'dm',
      ),
    ];
  }

  termsAction() {
    const { message } = this;
    return message.member.send(`Welcome to the server ${message.member}!\r\nYou can view the terms here!`);
  }
}
module.exports = WelcomeController;
