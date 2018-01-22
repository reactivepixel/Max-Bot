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
        null,
        'dm',
      ),
      new Command(
        '!announce',
        '!announce <channel_name>,[channel_name] <message>',
        'Announce To Channels',
        'Broadcast to multiple channels. Channels are case-sensitive.',
        this.announceAction.bind(controller),
        null,
        'reply',
        true,
      ),
      new Command(
        '!nominateChannel',
        '!nominateChannel <channel_name>',
        'Nominate Channel',
        'Nominate a game to create as a channel. Channel name cannot contain spaces.',
        this.nominateChannelAction.bind(controller),
        this.nominateChannelReaction.bind(controller),
      ),
    ];
    // Set a threshold votes must attain to pass
    this.voteThreshold = 10;
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

  nominateChannelAction() {
    const { message, voteThreshold } = this;
    // Channel name
    const channelName = message.parsed[1];
    const targetChannel = message.guild.channels.find('name', channelName);
    // Make sure channel doesn't exist
    if (!targetChannel) {
      // Add first reaction
      message.react('👍');
      message.reply(`Channel nominated, ${voteThreshold} thumbs ups needed to add it. The first one's on me!`);
    } else {
      // Channel exists, hide vote
      message.reply('That channel already exists.');
      message.delete();
    }
    return 'Channel Nomination.';
  }

  nominateChannelReaction() {
    const { message, voteThreshold } = this;
    // Channel name
    const channelName = message.parsed[1];
    // Gets count of reactions
    const reactionCount = message.reactions.find(reaction => reaction.emoji.name === '👍').count;
    // Check if reactions meet threshold
    if (reactionCount === voteThreshold) {
      message.guild.createChannel(channelName);
      message.reply(`Congrats! Your ${channelName} channel was voted on and created!`);
      message.delete();
    }
  }
}

module.exports = ChannelController;
