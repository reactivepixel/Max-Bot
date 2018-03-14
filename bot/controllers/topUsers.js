const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { Member } = require('../../db/models');

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
      Member.findAll({
        where: { verified: 1 },
        limit: parseInt(message.parsed[1], 10),
        order: [['points', 'DESC']],
      }).then((results) => {
        // Map out the data and set it equal to a variable
        const fullMessage = results.map(element =>
          `${element.dataValues.email}: ${element.dataValues.points} points`);
        // Send the message.
        // Not using return because it causes issues where it tries to return too early.
        message.author.send(fullMessage);
      });
    } else return 'Is that a number? You might want to try again.';
    // Adding a return since the ESLint tests will not pass without it
    return 'Top Users';
  }
}

module.exports = topPointsController;
