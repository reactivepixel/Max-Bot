const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const {
  Member,
} = require('../../db/models');

class ViewPointsController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!viewPoints',
        '!viewPoints',
        'Returns current point total.',
        'Receive a message with your current point total.',
        this.viewPointsAction.bind(controller),
        'dm',
      ),
    ];
  }

  async viewPointsAction() {
    const { message } = this;
    // Get Member Data
    const memberData = await Member.findAll({
      attributes: ['points'],
      where: {
        discordUser: message.author.id,
      },
    });
    // Get points
    const points = memberData[0].dataValues.points;
    message.author.send(`Your total Points: ${points}`);
  }
}

module.exports = ViewPointsController;
