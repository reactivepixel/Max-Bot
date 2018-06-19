const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class DetailsController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [
      new Command(
        '!tos',
        '!tos',
        'Resend Terms of Service',
        'Resend Terms of Service in private message.',
        this.channelTosAction.bind(controller),
        'dm',
      ),
      new Command(
        '!say',
        '!say',
        'Say Last Message',
        'Make the Bot say something.',
        this.channelReadAction.bind(controller),
      ),
      new Command(
        '!cat',
        '!cat',
        'Show a Cat',
        'Display an image of a Cat.',
        this.channelCatAction.bind(controller),
      ),
      new Command(
        '!number',
        '!number',
        'Random Number',
        'Generate a random number.',
        this.channelNumberAction.bind(controller),
      ),
    ];
  }

  channelTosAction() {
    const { username } = this.message.author;
    return 'Hello ' + username + ', here are the Terms of Service.';
  }

  channelReadAction() {
    const { content } = this.message;
    const newStr = content.replace('!say', '');
    return newStr;
  }

  channelCatAction() {
    const { channel } = this.message;
    return channel.send('Cat.', { files: ['https://i.imgur.com/znLN4AQ.jpg'] });
  }

  channelNumberAction() {
    const { channel } = this.message;
    return channel.send(Math.floor(Math.random() * 1000000));
  }
}

module.exports = DetailsController;
