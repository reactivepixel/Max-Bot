const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { Member } = require('../../db/models');

class newUserController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!welcome',
        '!welcome',
        'Send the welcome command again.',
        'Sends the welcome command with the methods of earning points',
        this.welcomeCommandAction.bind(controller),
        'dm',
      ),
    ];
  }

  welcomeCommandAction() {
    const { message } = this;
  }
}

module.exports = newUserController;
