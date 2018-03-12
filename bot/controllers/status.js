const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class StatusController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!status',
        '!status',
        'User status',
        'shows users status.',
        this.statusAction.bind(controller),
        'reply',
      ),
    ];
  }

  statusAction() {
    const { message } = this;
    // return `${message.author.username}, test`;
    return `${message.author.username}: ${message.author.presence.game.name}`;
  }
}

module.exports = StatusController;
