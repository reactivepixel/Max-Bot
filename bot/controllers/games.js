const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const https = require('https');
// const util = require('apex-util');

class GamesController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;

    this.commands = [
      new Command(
        '!8ball',
        '!8ball <question>',
        'Shakes 8 Ball',
        '',
        this.magic8ballAction.bind(controller),
      ),
      new Command(
        '!coinFlip',
        '!coinFlip',
        'Flip Coin',
        'Flip a coin.',
        this.coinFlipAction.bind(controller),
      ),
      new Command(
        '!rollDice',
        '!rollDice <side_of_dice>',
        'Roll Dice',
        'Roll a dice with sides of your choosing.',
        this.rollDiceAction.bind(controller),
      ),
      new Command(
        '!dadJoke',
        '!dadJoke',
        'Dad Joke',
        'Get a random dad joke.',
        this.dadJokeAction.bind(controller),
      ),
    ];
  }

  // Shakes the 8 ball
  magic8ballAction() {
    const { message } = this;
    // this is all of the responses the magic 8 ball can give
    const answers = [
    ];
    return '';
  }
  // Flip the coin
  coinFlipAction() {
    const { message } = this;
    return '';
  }
  // rolls the dice with the user set sides
  rollDiceAction() {
    const { message } = this;
    const sides = message.parsed[1];
    return '';
  }
  // makes a simple API request to icanhazdadjoke.com for a random dad joke
  dadJokeAction() {
    const { message } = this;
    const joke = [];
    // this holds the url for the api get request
    const options = {
      host: 'icanhazdadjoke.com',
      path: '/',
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      res.on('data', (data) => {
        // parse the data returned
        const body = JSON.parse(data.joke);
        // push the joke into the variable
        joke.push(body);
      });
    });
    req.end();
    return `Here is your joke ${message.author.username}: ${JSON.stringify(joke[0])}`;
  }
}

module.exports = GamesController;
