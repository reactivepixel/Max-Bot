const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const msg = require('../locale/messages.json');

const lang = process.env.LANGUAGE;

class ChannelController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!channels',
        '!channels',
        'List All Channels',
        msg.channels.helpMsg[lang],
        this.channelsAction.bind(controller),
        'dm',
      ),
      new Command(
        '!announce',
        '!announce <channel_name>,[channel_name] <message>',
        'Announce To Channels',
        msg.announce.helpMsg[lang],
        this.announceAction.bind(controller),
        'reply',
        true,
      ),
    ];
  }

  channelsAction() {
    const { message } = this;
    const channels = [];
    message.guild.channels.map(channel => channels.push(channel.name));
    return msg.channels.msg[lang] + channels.join('\n');
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
        return '"' + channel + '" ' + msg.channels.errorMsg[lang];
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
      return targetChannel.send(sender + msg.announce.msg[lang] + preparedMessage + '```');
    });

    return msg.announce.msgReturn[lang];
  }
}

module.exports = ChannelController;
