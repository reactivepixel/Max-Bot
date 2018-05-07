const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class AddGameController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!addGame',
        '!addGame <game_name>',
        'Add new game',
        'Adds new game to channels and roles.',
        this.addGameAction.bind(controller),
      ),
    ];
  }
  addGameAction() {
    const { message } = this;
    const gameName = message.parsed[1];

    message.guild.createChannel(gameName.toLowerCase(), 'text').then(
      (textChannel) => {
        textChannel.setParent('441995839892750337');
      },
    );

    message.guild.createChannel(gameName.split('-').join(' '), 'voice').then(
      (voiceChannel) => {
        voiceChannel.setParent('441995839892750339');
      },
    );

    message.guild.createRole({
      name: gameName.split('-').join('_'),
      color: 'RED',
      hoist: false,
      position: 2,
      mentionable: false,
    });
  }
}
module.exports = AddGameController;
