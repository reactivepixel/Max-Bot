const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class StreamerLiveController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!twitchLive',
        '!twitchLive <twitch_name>',
        'Twitch Live',
        'A quick easy way to announce you are going live on Twitch.',
        this.addTwitchAction.bind(controller),
      ),
    ];
  }
  addTwitchAction() {
    const { message } = this;
    const twitchName = message.parsed[1];
    const nameList = `https://www.twitch.tv/${twitchName}`;
  }
}
module.exports = StreamerLiveController;
