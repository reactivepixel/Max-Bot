const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class GamesController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;

    this.commands = [
      new Command(
        '!8ball',
      ),
      new Command(
        'coinFlip',
      ),
    ];
  }
}

module.exports = GamesController;
