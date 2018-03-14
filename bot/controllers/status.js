const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class StatusController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!status',
        '!status',
        'User status',
        'shows users status.',
        this.statusAction.bind(controller),
        'reply',
      ),
    ];
  }

  // statusAction() {
  //   const { message } = this;
  //   // return `${message.author.username}, test`;
  //   return `${message.author.username}: ${message.author.presence.game.name}`;
  // }

  statusAction() {
    const { message } = this;
    const type = message.author.presence.game.type;
    const name = message.author.presence.game.name;

    if (type === null) {
      console.log(' 🔥🔥🔥 ', type);
      return `${message.author.username} Nothing`;
    } else if (type === 0) {
      console.log(message.author.username + ' Playing ' + name + ' type -> ' + type);
      return `${message.author.username} Playing ` + name;
    } else if (type === 1) {
      console.log(message.author.username + ' Streaming ' + name + ' type -> ' + type);
      return `${message.author.username} Streaming ` + name;
    } else if (type === 2) {
      console.log(message.author.username + ' Listening to ' + name + ' type -> ' + type);
      return `${message.author.username} Listening to ` + name;
    } else {
      console.log(' ❌❌❌ ', type);
      return `${message.author.username} Broken`;
    }
  }
  // type [0, 1, 2]
  // 0    Game         Playing {name}        "Playing Rocket League"
  // 1    Streaming    Streaming {name}      "Streaming Rocket League"
  // 2    Listening    Listening to {name}   "Listening to Spotify"
}

module.exports = StatusController;
