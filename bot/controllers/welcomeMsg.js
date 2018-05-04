const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class WelcomeMsgController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [new Command('!welcome', '!welcome', 'Re-Send Welcome Message', 'Send Welcome Message to User', this.channelsAction.bind(controller), 'dm')];
  }

  channelsAction() {
    const { message } = this;
    return `Welcome to the server ${message.author.username}`;
  }
}

module.exports = WelcomeMsgController;
