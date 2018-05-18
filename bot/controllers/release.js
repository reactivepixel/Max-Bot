const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

// Import Package.json
const pjson = require('../../package.json');

class ReleaseController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;
    this.pjson = pjson;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!version',
        '!version',
        'Max Bot\'s Current Version Number',
        'Post Max Bot\'s Current Version Number in Current Channel',
        this.ReleaseAction.bind(controller),
      ),
    ];
  }

  ReleaseAction() {
    // Post Max Bot's Current Version Number from the Package.json version
    return `My Current Version is ${this.pjson.version}`;
  }
}
module.exports = ReleaseController;
