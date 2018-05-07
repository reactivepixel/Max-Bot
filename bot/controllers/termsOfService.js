const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class TermsController extends BaseController {
  constructor(message) {
    super(message);
    this.commands = [
      new Command(
        '!tos',
        'Terms of Service',
        this.termsAction.bind(this),
        'dm',
      ),
    ];
  }


  termsAction() {
    const { message } = this;
    return `${message.author.username} Please read our Terms of Service agreement. If you would like to see it again simply type !tos`;
  }
};
module.exports = TermsController;
