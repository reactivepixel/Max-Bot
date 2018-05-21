const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class PollController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!poll',
        '!poll <question> <option_1> <option_2> <option_3>',
        'Creates User Polls',
        'Creates a Poll for users to vote on!',
        this.pollAction.bind(controller),
      ),
    ];
  }

  pollAction() {
    const { message } = this;
    return message;
  }
}
module.exports = PollController;
