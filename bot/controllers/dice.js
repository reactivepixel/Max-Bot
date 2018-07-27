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
        '!roll <roll_count><die_type>,[roll_count][die_type]',
        'Rolls the dice',
        'Rolls dice based on the user input. Must be in #D# format. Example: 1D20 rolls a single D20.',
        this.rollAction.bind(controller),
      ),
    ];
  }

  // Perform the rolling of the dice
  rollAction() {
    const { message } = this;
    const diceCommand = message.parsed[1].split(',');
    util.log('Parsed message: ', diceCommand, 4);
    let total = 0;
    let rollsString = '';

    diceCommand.map((singleDie) => {
      // Get the specifics of the roll based on the location of the 'd'
      let rollCount = singleDie.toLowerCase().substr(0, singleDie.indexOf('d'));
      const sides = singleDie.toLowerCase().substr(singleDie.indexOf('d') + 1);
      const dieName = 'D' + sides; // Name of the current dice

      // Loop for the amount of rolls needed
      while (rollCount !== 0) {
        // Perform the random number selection
        const rollNumber = Math.floor((Math.random() * sides) + 1);
        rollsString += dieName + ': ' + rollNumber + '\n';
        rollCount -= 1;

        // Add roll to the total
        total += rollNumber;
      }
      return rollsString;
    });
    // Create the results string
    const results = 'here are your results! \n' + rollsString + '\n**Total: ' + total + '!**';

    // Return results
    return results;
  }
}

module.exports = DiceController;
