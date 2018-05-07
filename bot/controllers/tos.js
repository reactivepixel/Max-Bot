const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class TosController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
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
    const { message } = this;
    return `${message.author.username} read our Terms of service`;
  }
}
module.exports = TosController;
