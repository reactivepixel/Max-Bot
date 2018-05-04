const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const { Member } = require('../../db/models');

class topUsersController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!topUsers',
        '!topUsers <num_users_wanted>',
        'Return Top Number of Users',
        true,
        'Sends a message with the users with the most points earned.',
        this.topUsersAction.bind(controller),
        'dm',
      ),
    ];
  }

  topUsersAction() {
    const { message } = this;
    // Check to see if the user added a number
    if (!isNaN(message.parsed[1])) {
      // Grab all the entries with the limit and sort descending
      Member.findAll({
        where: { verified: 1 },
        limit: parseInt(message.parsed[1], 10),
        order: [['points', 'DESC']],
      }).then((memberData) => {
        // Map out the data and set it equal to a variable
        const fullMessage = memberData.map(member =>
          `${member.dataValues.email}: ${member.dataValues.points} points`);
        // Send the message.
        // Not using return because it causes issues where it tries to return too early.
        message.author.send(fullMessage);
      });
    } else return 'Is that a number? You might want to try again.';
    // Adding a return since the ESLint tests will not pass without it
    return 'Top Users';
  }
}

module.exports = topUsersController;
