const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
// const util = require('apex-util');

class ChannelController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!welcome',
        '!welcome',
        'Send Welcome Message',
        'Sends the Welcome Message to the User',
        this.welcomeAction.bind(controller),
        'dm',
      ),
    ];
  }

  welcomeAction() {
    const { message } = this;
    const channels = [];
    message.guild.channels.map(channel => channels.push(channel.name));
    return 'List of all Armada Channels: \n\n' + channels.join('\n');
  }
}

module.exports = ChannelController;
