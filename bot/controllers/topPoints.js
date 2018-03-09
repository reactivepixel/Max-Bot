const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const models = require('../../db/models');
const util = require('apex-util');

class topPointsController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!topUsers',
        '!topUsers <Limit_Wanted>',
        'Return Top Number of Users',
        'Sends a message with the users with the most points earned.',
        this.topPointsAction.bind(controller),
        'dm',
      ),
    ];
  }

  topPointsAction() {
    const { message } = this;
    util.log('Limit Wanted', message.parsed[1], 4);
    if (!isNaN(message.parsed[1])) {
      const users = models.Member.findAll(
        {
          where: { verified: 1 },
          limit: parseInt(message.parsed[1], 10),
          order: [['points', 'DESC']],
        },
      );
      util.log('TRYING', users, 4);
      return 'nope';
    }
    return 'Is that a number? You might want to try again.';
  }
}
module.exports = topPointsController;
