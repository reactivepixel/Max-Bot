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
        '!announce <channel_name>, <message>',
        'Announce To Channels',
        'Broadcast to multiple channels. Channels are case-sensitive.',
        this.announceAction.bind(controller),
        'reply',
        true,
      ),
      new Command(
        '!humorMe',
        '!humorMe',
        'Hear a Joke',
        'Have max-bot message you a random gaming joke.',
        this.humorAction.bind(controller),
        'dm',
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

  humorAction() {
    let { message } = this;
    // Compliments of gamedesigning.org
    const jokes = [
      'My girlfriend told me to stop plyaing Pokemon as it was childish.\n\nI started thrashing about and roared "You don\'t have enough badges to control me!"',
      'What is the national sport of Minecraft?\n\nBoxing.',
      'What do you get if you tape a stick of dynamite to a hedgehog?\n\nA Sonic boom',
      'My girlfriend just left me because of my overwhelming obsession with Assassin\'s Creed.\n\nI tried to explain I can\'t Altair the past.',
      'What does a gorilla wear to the beach?\n\nDonkey Thong.',
      'What\'s Samus\' favorite food?\n\nMetroid Prime Rib.',
      'Why does Donkey Kong always brush his teeth?\n\nTo prevent tooth DK.',
      'Which video game system is always late?\n\nAtardi.',
      'While driving yesterday, I saw a banana skin on the road and instinctively swerved to avoid it. Thanks, Mario Kart!',
      'How did Link win the basketball game?\n\nHe used his hookshot.',
      'Why was Navi on the internet?\n\nShe was looking for a Link.',
      'Why couldn\'t Toad put an indoor pool in his house?\n\nIt took up too mushroom.',
    ];
    message = jokes[Math.floor(Math.random() * jokes.length)];
    return message;
  }
}

module.exports = ChannelController;
