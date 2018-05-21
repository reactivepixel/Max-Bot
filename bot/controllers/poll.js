const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class PollController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!poll',
        '!poll <ask-a-question> <option_1> <option_2> <option_3>',
        'Posts a Question users can vote on',
        'Posts a Question users can vote on, use "-" to separate words in your question',
        this.pollAction.bind(controller),
      ),
    ];
  }

  pollAction() {
    const { message } = this;
    const question = message.parsed[1];
    const questionSpaced = question.split('-').join(' ');
    const content = message.content;
    const count = content.split(' ').length;

    let options = '';

    if (count >= 2 && count <= 11) {
      for (let i = 2; i < count; i += 1) {
        if (i === 2) {
          options += `\r \u0031\u20E3${message.parsed[i]}`;
        } else if (i === 3) {
          options += `\r \u0032\u20E3${message.parsed[i]}`;
        } else if (i === 4) {
          options += `\r \u0033\u20E3${message.parsed[i]}`;
        } else if (i === 5) {
          options += `\r \u0034\u20E3${message.parsed[i]}`;
        } else if (i === 6) {
          options += `\r \u0035\u20E3${message.parsed[i]}`;
        } else if (i === 7) {
          options += `\r \u0036\u20E3${message.parsed[i]}`;
        } else if (i === 8) {
          options += `\r \u0037\u20E3${message.parsed[i]}`;
        } else if (i === 9) {
          options += `\r \u0038\u20E3${message.parsed[i]}`;
        } else if (i === 10) {
          options += `\r ️\u0039\u20E3${message.parsed[i]}`;
        }
      }
    } else {
      return 'The poll can not expect 0 or more than 9 options';
    }

    const query = `"${questionSpaced}" \r ${options}`;
    message.channel.send(query)
      .then((message) => {
        for (let i = 2; i < count; i += 1) {
          if (i === 2) {
            message.react('\u0031\u20E3');
          } else if (i === 3) {
            message.react('\u0032\u20E3');
          } else if (i === 4) {
            message.react('\u0033\u20E3');
          } else if (i === 5) {
            message.react('\u0034\u20E3');
          } else if (i === 6) {
            message.react('\u0035\u20E3');
          } else if (i === 7) {
            message.react('\u0036\u20E3');
          } else if (i === 8) {
            message.react('\u0037\u20E3');
          } else if (i === 9) {
            message.react('\u0038\u20E3');
          } else if (i === 10) {
            message.react('\u0039\u20E3');
          }
        }
      }).catch(() => {
        util.error('pollAction reaction failed');
      });
    return ' wants to know.';
  }
}

module.exports = PollController;
