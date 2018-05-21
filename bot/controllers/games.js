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
        '!rollDice <sides_of_the_dice>',
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
    const flip = Math.floor(Math.random() * 2);
    if (flip === 0) {
      return 'You just flipped HEADS!';
    } else {
      return 'You just flipped TAILS!!';
    }
  }
  // rolls the dice with the user set sides
  rollDiceAction() {
    const { message } = this;
    const sides = message.parsed[1];
    const roll = Math.floor(Math.random() * sides) + 1;
    if (!isNaN(sides)) {
      return `Look at that. ${message.author.username} just rolled a ${roll}`;
    } else {
      return `Sorry ${message.author.username}, It looks like you didn't enter a number.`;
    }
  }
  // makes a simple API request to icanhazdadjoke.com for a random dad joke
  dadJokeAction() {
    const { message } = this;
    let joke = '';
    const jokeStore = [];
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
        const body = JSON.parse(JSON.stringify(data));
        // push the joke into the variable
        jokeStore.push(body);
      });
    });
    req.end();
    joke = jokeStore[0];
    return `Here is your joke ${message.author.username}!! ${joke}`;
  }
}

module.exports = GamesController;
