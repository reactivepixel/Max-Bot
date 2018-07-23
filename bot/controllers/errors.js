const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { isServerAdmin } = require('../botUtils.js');
// const models = require('../../db/models');

class ErrorController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!toggleErrors',
        '!toggleErrors',
        'Toggle Show/Hide Bot Errors',
        'If enabled, bot errors will be sent to you via dm.',
        this.toggleErrors.bind(controller),
      ),
      new Command(
        '!fetchErrors',
        '!fetchErrors [errorCount] [username]',
        'Fetch the last X number of errors the bot has logged',
        'Retrieve the last X number of errors the bot has logged. ' +
        'If you provide a username, it will filter based on that user.',
        this.fetchErrors.bind(controller),
      ),
    ];
  }

  // Enables or disables error presentation to use with correct role.
  toggleErrors() {
    const { message } = this;

    if (isServerAdmin(message)) {
      return 'Not Implemented. Upon completion, this will toggle your ability to receive error info.';
    } else {
      this.onError(`User ${message.member.displayName} tried to perform an admin function but wasn't an admin.`, message.member.id);
      return 'You must be in a role that\'s marked as an administrator to use this feature!';
    }
  }

  // Fetches last X errors logged
  fetchErrors(/* errorCount, username */) {
    const { message } = this;

    if (isServerAdmin(message)) {
      // TODO: Add logic to constrain errors to specific user if username was provided.
      // TODO: Add logic to query log table based on username
      // TODO: Add logic to query entire log table based on errorCount provided
      return 'Neat! You are an admin. This feature is not implemented yet.';
    } else {
      this.onError(`User ${message.member.displayName} tried to perform an admin function but wasn't an admin.`, message.member.id);
      return 'You must be in a role that\'s marked as an administrator to use this feature!';
    }
  }
}

module.exports = ErrorController;
