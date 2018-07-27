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
    let invalidDie = false;

    diceCommand.map((singleDie) => {
      // Convert string to lowercase
      const singleDieLowercase = singleDie.toLowerCase();

      // Checks if the user has a 'd' and then if there is a number before and after the 'd'
      if (singleDieLowercase.includes('d') && (singleDieLowercase.indexOf('d') - 1) > -1 && (singleDieLowercase.substr(singleDieLowercase.indexOf('d') + 1))) {
        // Get the specifics of the roll based on the location of the 'd'
        let rollCount = singleDieLowercase.substr(0, singleDieLowercase.indexOf('d'));
        const sides = singleDieLowercase.substr(singleDieLowercase.indexOf('d') + 1);
        const dieName = 'D' + sides; // Name of the current dice

        // Loop for the amount of rolls needed
        while (rollCount !== 0) {
          // Perform the random number selection
          const rollNumber = Math.floor((Math.random() * sides) + 1);
          rollsString += dieName + ': ' + rollNumber + '\n';
          rollCount -= 1;
          total += rollNumber;
        }
        return rollsString;
      } else {
        // Set the invalidDie to true
        invalidDie = true;
        return invalidDie;
      }
    });

    // Check if input was invalid
    if (invalidDie === false) {
      // Create the results string if input was valid
      const results = 'here are your results! \n' + rollsString + '\n**Total: ' + total + '!**';

      // Return results
      return results;
    } else {
      return 'The dice you entered is invalid, please make sure to use the proper format **#D#**!';
    }
  }
}

module.exports = DiceController;
