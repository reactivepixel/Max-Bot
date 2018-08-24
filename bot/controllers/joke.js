const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
let request = require('request');

class JokeController extends BaseController {
  constructor(message) {
    super(message);

    this.commands = [
      new Command(
        '!joke',
        '!joke',
        'Tells a joke',
        'Tells a random geeky joke. Reenter command to get a new joke.',
        this.jokeAction.bind(this),
      ),
    ];
  }

  // Makes a request to joke API and outputs the joke
  jokeAction() {
    var options = {
      url: 'https://geek-jokes.sameerkumar.website/api',
      method: 'GET'
    }

    request(options, (err, response, body) => {
      if(!err && response.statusCode == 200) {
        util.log(body);
      }
    });
  }
}

module.exports = JokeController;
