const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const fetch = require('node-fetch');

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
      'It is certian',
      'It is decidedly so',
      'Without a doubt',
      'Yes definitely',
      'You may rely on it',
      'You can count on it',
      'As I see it, yes',
      'Most likely',
      'Outlook good',
      'Yes',
      'Signs point to yes',
      'Absolutely',
      'Reply hazy try again',
      'Ask again later',
      'Better not tell you now',
      'Cannot predict now',
      'Concentrate and ask again',
      'Don\'t count on it',
      'My reply is no',
      'My sources say no',
      'Outlook not so good',
      'Very doubtful',
      'Chances aren\'t good',
    ];
    const shake = Math.floor(Math.random() * answers.length);
    return message.author.username + ' shakes the 8 ball and gets: ```' + answers[shake] + '```';
  }
  // Flip the coin
  coinFlipAction() {
    const { message } = this;
    const flip = Math.floor(Math.random() * 2);
    if (flip === 0) {
      return `You just flipped HEADS! Way to go ${message.author.username}`;
    } else {
      return `You just flipped TAILS!! Way to go ${message.author.username}`;
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
    // this holds the url for the api get request
    const options = {
      method: 'GET',
      headers: {
        accept: 'text/plain',
      },
    };
    fetch('https://icanhazdadjoke.com/', options)
      .then(res => res.text())
      .then(body => message.channel.send(`Here is your joke ${message.author.username}!! ${body}`));
    return 'Want to hear a joke?';
  }
}

module.exports = GamesController;
