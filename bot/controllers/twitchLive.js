const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
// const util = require('apex-util');

class StreamerLiveController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!twitchLive',
        '!twitchLive <twitch_name> <twitch_game>',
        'Twitch Live',
        'A quick easy way to announce you are going live on Twitch.',
        this.addTwitchAction.bind(controller),
        'reply',
        true,
      ),
    ];
  }
  addTwitchAction() {
    const { message } = this;
    const twitchName = message.parsed[1];
    const twitchURL = `https://www.twitch.tv/${twitchName}`;
    const twitchGame = message.parsed[2];
    const streamMessage = `Hey everyone! ${twitchName} is going live playing ${twitchGame}!! Check him out at ${twitchURL} !`;
    const targetChannel = message.guild.channels.get('319548128267206666');
    const sender = message.author.username;
    return targetChannel.send('```' + sender + ' has an announcment: ```' + streamMessage);
  }
}
module.exports = StreamerLiveController;
