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
        'A quick easy way to ',
        this.addTwitchAction.bind(controller),
      ),
    ];
  }
  addTwitchAction() {
    const { message } = this;
    const streamName = message.parsed[1];
    const twitchClientID = '';
    const nameList = {};
  }
}
module.exports = StreamerLiveController;
