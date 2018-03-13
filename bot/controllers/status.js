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
    const activityName = message.author.presence.game.name;
    if (activityName === null) {
      console.log('User is not active');
      return 'Nothing';
    } else {
      // type [0, 1, 2]
      // 0    Game         Playing {name}        "Playing Rocket League"
      // 1    Streaming    Streaming {name}      "Streaming Rocket League"
      // 2    Listening    Listening to {name}   "Listening to Spotify"
      console.log(message.author.username + ' name -> ' + message.author.presence.game.name + ' type -> ' + message.author.presence.game.type);
      return `Memeber -> ${message.author.username} is using ${message.author.presence.game.name}`;
    }
  }
}

module.exports = StatusController;
