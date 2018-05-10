const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const { messages } = require('../botUtils.js');

class AddGameController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!addGame',
        '!addGame <game_name>',
        'Add new game',
        'Add game to channels & roles.',
        this.addGameAction.bind(controller),
        'dm',
        true,
      ),
    ];
  }

  addGameAction() {
    const { message } = this;
    const gameName = message.parsed[1];
    const textCat = '441995839892750337'; // Game Text Channel ID
    const voiceCat = '441995839892750339'; // Game Voice Channel ID
    if (gameName) {
      // Create Text Channel for new game & make lowercase
      message.guild.createChannel(gameName.toLowerCase(), 'text').then(
        (textChannel) => {
          // Text channel category ID
          textChannel.setParent(textCat);
        },
        util.log('Text Channel Created for ', gameName, 0),
      );
      // Create Voice Channel for new game & changes - to spaces
      message.guild.createChannel(gameName.split('-').join(' '), 'voice').then(
        (voiceChannel) => {
          // Voice channel category ID
          voiceChannel.setParent(voiceCat);
        },
        util.log('Voice Channel Created for ', gameName, 0),
      );
      // Create Role for new game & changes - into _
      message.guild.createRole({
        name: gameName.split('-').join('_'),
        color: 'RED',
        hoist: false,
        position: 2,
        mentionable: false,
      }).then(
        util.log('Role Created for ', gameName, 0),
      );
      return messages.newChannel(message.author.id) + gameName;
    } else {
      return util.log('Error: ' + gameName + ' Channel already exists!', 0);
    }
  }
}
module.exports = AddGameController;
