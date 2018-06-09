const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class DetailsController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!tos',
        '!tos',
        'Resend Terms of Service',
        'Resend Terms of Service in private message.',
        this.channelTosAction.bind(controller),
        'dm',
      ),
    ];
  }

  channelTosAction() {
    const { username } = this.message.author;
    return 'Hello ' + username + ', here are the Terms of Service.';
  }
}

module.exports = DetailsController;
