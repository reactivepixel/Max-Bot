const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class DiceController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!roll',
        '!roll <die_type>',
        'Rolls the dice',
        'Rolls a die based on the user input',
        this.rollAction.bind(controller),
      ),
      new Command(
        '!listDice',
        '!listDice',
        'Lists All Dice',
        'Sends the user a dm containing a list of all the dice available.',
        this.listDice.bind(controller),
        'dm',
      ),
    ];
  }

  // Perform the rolling of the dice
  rollAction() {
    const { message } = this;
    const dice = message.parsed[1].split(',');
    util.log('Parsed message: ', dice, 4);
    let results = 'You rolled a ';

    // Decide what equation to run based on the dice type
    switch (dice.toString()) {
      case 'D4':
        results += Math.floor((Math.random() * 4) + 1);
        break;
      case 'D6':
        results += Math.floor((Math.random() * 6) + 1);
        break;
      case 'D8':
        results += Math.floor((Math.random() * 8) + 1);
        break;
      case 'D10':
        results += Math.floor((Math.random() * 10) + 1);
        break;
      case 'D12':
        results += Math.floor((Math.random() * 12) + 1);
        break;
      case 'D20':
        results += Math.floor((Math.random() * 20) + 1);
        break;
      default:
        // Return an error if user didn't input a supported die type
        results = 'You rolled an unidentified die, please use `!listDice` to see all available dice!';
        break;
    }

    // Return results
    return results;
  }

  // List all the dice
  listDice() {
    const { message } = this;
    const dice = ['D4', 'D6', 'D8', 'D10', 'D12', 'D20']; // Dice array
    let diceString = 'Here is a list of all available dice:';

    // Map the dice array and add it to the string to return
    dice.map((val) => {
      diceString += '\n' + val;
      return diceString;
    });

    // Send an embedded message to the user in their dms
    message.member.send({ embed: {
      color: 0x9d0a0e,
      description: diceString,
    } });
    return 'Use this information wisely!';
  }
}

module.exports = DiceController;
