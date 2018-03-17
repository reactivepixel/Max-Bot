const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { Member } = require('../../db/models');

class ViewPointsController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!viewPoints',
        '!viewPoints',
        'Return Users Current Points',
        'Receive a message with the users current points.',
        this.viewPointsAction.bind(controller),
        'dm',
      ),
    ];
  }

  async viewPointsAction() {
    const {message} = this;
    message.author.send("points");
  }
}

module.exports = ViewPointsController;