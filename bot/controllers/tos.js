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
        'Terms of Service',
        'Sends Copy of the Terms of Service via Direct Messages',
        this.tosAction.bind(controller),
        'dm',
      ),
    ];
  }

  tosAction() {
    // Send Direct Message with the Terms of Service
    const { message } = this;
    return `Welcome <@${message.author.id}> to the Full Sail Armada! Read our Terms of Service`;
  }
}
module.exports = TosController;
