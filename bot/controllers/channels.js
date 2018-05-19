const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class ChannelController extends BaseController {
  constructor(eventObj) {
    super(eventObj);
    const controller = this;
    this.commands = [
      new Command(
        '!channels',
        '!channels',
        'List All Channels',
        'List all available Armada channels.',
        this.channelsAction.bind(controller),
        'dm',
      ),
      new Command(
        '!announce',
        '!announce <channel_name>,[channel_name] <eventObj>',
        'Announce To Channels',
        'Broadcast to multiple channels. Channels are case-sensitive.',
        this.announceAction.bind(controller),
        'reply',
        true,
      ),
    ];
  }

  channelsAction() {
    const { eventObj } = this;
    const channels = [];
    eventObj.guild.channels.map(channel => channels.push(channel.name));
    return 'List of all Armada Channels: \n\n' + channels.join('\n');
  }

  announceAction() {
    const { eventObj } = this;
    const channels = eventObj.parsed[1].split(',');
    util.log('Multiple Channels Parsing', channels, 4);

    channels.map((channel) => {
      const targetChannel = eventObj.guild.channels.find('name', channel);
      const sender = eventObj.author.username;
      util.log('Asking API for Channel', targetChannel, 4);

      if (targetChannel === null) {
        return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all Channels (They are case-sensitive)';
      }

      // Set parsed value to 2 for eventObj.
      let msgParsedIndex = 2;
      let preparedMessage = '';

      // Loop through/join user eventObj by space until end.
      while (msgParsedIndex < eventObj.parsed.length) {
        // Add spaces after first word
        if (msgParsedIndex !== 2) {
          preparedMessage += ' ';
        }
        preparedMessage += eventObj.parsed[msgParsedIndex];
        msgParsedIndex += 1;
      }
      return targetChannel.send(sender + ' has an announcment: ```' + preparedMessage + '```');
    });

    return 'Broadcast sent!';
  }
}

module.exports = ChannelController;
