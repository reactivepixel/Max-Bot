const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const models = require('../../db/models');

class topPointsController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!topUsers',
        '!topUsers <Limit_Wanted>',
        'Return Top Number of Users',
        true,
        'Sends a message with the users with the most points earned.',
        this.topPointsAction.bind(controller),
        'dm',
      ),
    ];
  }

  topPointsAction() {
    const { message } = this;
    // Check to see if the user added a number
    if (!isNaN(message.parsed[1])) {
      // Grab all the entries with the limit and sort descending
      models.Member.findAll(
        {
          where: { verified: 1 },
          limit: parseInt(message.parsed[1], 10),
          order: [['points', 'DESC']],
        },
      ).then((results) => {
        // Map out the data and set it equal to a variable
        const fullMessage = results.map(element => `User: ${element.dataValues.email} Points: ${element.dataValues.points}`);
        // Send the message. Not using return because it breaks.
        message.author.send(fullMessage);
      });
    } else return 'Is that a number? You might want to try again.';
    // Return a header because it'll break otherwise
    return 'Top Users';
  }
}

module.exports = topPointsController;
