const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class StreamerLiveController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!live',
        '!live <streaming_platform> <streamer_name> <game_streaming>',
        'Live',
        'A quick and easy way to announce you are going live on Twitch or Mixer.',
        this.addStreamAnnounce.bind(controller),
        'reply',
        true,
      ),
    ];
  }
  addStreamAnnounce() {
    const { message } = this;
    // capture the platform the user is broadcasting to
    const platform = message.parsed[1].toLowerCase();
    // capture the users name on the streaming service
    const streamerName = message.parsed[2];
    // capture the game they are broadcasting
    const game = message.parsed[2];
    // set the target channel to the twitch text channel
    const targetChannel = message.guild.channels.find('name', 'streamers');
    // capture the name of the person that is sending the announcement
    const sender = message.author.username;
    // check if the channel exists
    if (targetChannel) {
      // check to see if the platform was set to twitch
      if (platform === 'twitch') {
        // sets the URL that is going to be sent for the announcement
        const twitchURL = `https://www.twitch.tv/${streamerName}`;
        // creates a message for the twitch platform
        const twitchMessage = `Hey everyone! ${streamerName} is going live on Twitch and they are playing ${game}!! Check them out at ${twitchURL} !`;
        // send the announcement
        return targetChannel.send('```' + sender + ' has an announcment: ```' + twitchMessage);
      } else if (platform === 'mixer') {
        const mixerURL = `https://mixer.com/${streamerName}`;
        const mixerMessage = `Hey everyone! ${streamerName} is going live on Mixer and they are playing ${game}!! Check them out at ${mixerURL} !`;
        return targetChannel.send('```' + sender + ' has an announcment: ```' + mixerMessage);
      }
    } else {
      return "I am sorry I couldn't find the proper channel.";
    }
  }
}
module.exports = StreamerLiveController;
