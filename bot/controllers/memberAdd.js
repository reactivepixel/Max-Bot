const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class MemberAddController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!memberWelcome',
        '!memberWelcome',
        'Send member welcome DM again',
        'Resend the welcome direct message recieved when member joined server.',
        this.memberAddMsg.bind(controller),
        'dm',
      ),
    ];
  }

  memberAddMsg() {
    const { message } = this;
    return `Welcome to ${message.member.guild}, ${message.member.user.username}! You joined our guild on ${message.member.joinedAt}.`;
  }
}

module.exports = MemberAddController;
