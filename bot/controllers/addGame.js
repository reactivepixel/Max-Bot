const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const { getUserPointsandUpdate } = require('../botUtils');


class AddGameController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!addGame',
        '!addGame <game_name>',
        'List All Channels',
        'List all available Armada channels.',
        this.addGameAction.bind(controller),
        'dm',
      ),
    ];
  }
  addGameAction() {
    const { message } = this;
    const pointValue = 1;
    const gameName = message.parsed[1].toLowerCase();
    message.guild.createChannel(gameName, 'text')
      .then((text, err) => {
        if (err)util.log('the game could not be added: ', err, 3);
        getUserPointsandUpdate(message.author.id, pointValue);
      });
    message.guild.createChannel(gameName, 'voice');
  }
}


module.exports = AddGameController;
