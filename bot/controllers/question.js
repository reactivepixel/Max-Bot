const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class QuestionController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!question',
        '!question <ask-a-question>',
        'Posts a Question users can vote on',
        'Posts a Question users can vote on, use "-" to separate words in your question',
        this.questionsAction.bind(controller),
      ),
    ];
  }

  questionsAction() {
    const { message } = this;
    const question = message.parsed[1];
    const query = `"${question.split('-').join(' ')}?"`;
    message.channel.send(query)
      .then((message) => {
        message.react('👍');
        message.react('🤔');
        message.react('👎');
      }).catch(() => {
        util.error('questionAction reaction failed');
      });
    return ' wants to know.';
  }
}

module.exports = QuestionController;
