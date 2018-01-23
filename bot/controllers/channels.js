const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class ChannelController extends BaseController {
  constructor(message) {
    super(message);
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
        '!announce <channel_name>,[channel_name] <message>',
        'Announce To Channels',
        'Broadcast to multiple channels. Channels are case-sensitive.',
        this.announceAction.bind(controller),
        'reply',
        true,
      ),
      new Command(
        '!announceStatus',
        '!announceStatus <ready>,<away>,<gone>',
        'Announce To All Channels Availability Status',
        'Broadcast to all channels that you are ready, away, or gone from your machine.',
        this.statusAction.bind(controller),
        'reply',
      ),
    ];
  }

  channelsAction() {
    const { message } = this;
    const channels = [];
    message.guild.channels.map(channel => channels.push(channel.name));
    return 'List of all Armada Channels: \n\n' + channels.join('\n');
  }

  announceAction() {
    const { message } = this;
    const channels = message.parsed[1].split(',');
    util.log('Multiple Channels Parsing', channels, 4);

    channels.map((channel) => {
      const targetChannel = message.guild.channels.find('name', channel);
      const sender = message.author.username;
      util.log('Asking API for Channel', targetChannel, 4);

      if (targetChannel === null) {
        return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all Channels (They are case-sensitive)';
      }

      // Set parsed value to 2 for message.
      let msgParsedIndex = 2;
      let preparedMessage = '';

      // Loop through/join user message by space until end.
      while (msgParsedIndex < message.parsed.length) {
        // Add spaces after first word
        if (msgParsedIndex !== 2) {
          preparedMessage += ' ';
        }
        preparedMessage += message.parsed[msgParsedIndex];
        msgParsedIndex += 1;
      }
      return targetChannel.send(sender + ' has an announcment: ```' + preparedMessage + '```');
    });

    return 'Broadcast sent!';
  }

  statusAction() {
    const { message } = this;
    const userStatus = message.parsed[1];

    // Available status list
    const status = [{
      type: 'ready',
      message: ' is here and ready. LETS GO',
    }, {
      type: 'away',
      message: ' is collecting thoughts. Not many, be back soon',
    }, {
      type: 'gone',
      message: ' has gone fishing. Or something. Will not be here though',
    }];

    // Collect available channels
    const channels = [];
    message.guild.channels.map(channel => channels.push(channel.name));

    // Send status to all collected channels
    channels.map((channel) => {
      const sender = message.author.username;

      // Determine status entered and send announcement
      status.map((availStatus) => {
        if (userStatus !== availStatus.type) {
          return userStatus + ' is not a known status. Please choose "ready", "away", or "gone".';
        }

        return channel.send(sender + availStatus.message);
      });
    });

    // Confirm status message sent
    return userStatus + ' status announcement sent to all channels!';
  }
}

module.exports = ChannelController;
