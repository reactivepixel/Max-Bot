const util = require('apex-util');
const { isInElevatedRole } = require('./botUtils.js');
const models = require('../db/models');

class BaseController {
  constructor(message) {
    // Add middleware to saved message
    this.message = BaseController.messageMiddleware(message);
    this.commands = [];
  }

  // Add extra information to message object
  static messageMiddleware(message) {
    // Creates an empty object container
    const messageContainer = {};
    // Tokenizes the message by space characters, adds to container
    messageContainer.parsed = message.content.split(' ');
    // Adds message object to container
    return Object.assign(message, messageContainer);
  }

  onSuccess(commandResponse, command) {
    if (commandResponse !== null) {
      // Determine how to respond to message
      if (command.responseType === 'reply') {
        return this.message.reply(commandResponse);
      } else if (command.responseType === 'dm') {
        return this.message.author.send(commandResponse);
      }
    }
    // Fail safe
    return false;
  }

  onError(errorMessage, userId = 'system', message) {
    const ErrorController = require('./controllers/errors');

    if (message !== undefined) {
      const ec = new ErrorController(message);
      ec.sendErrors(errorMessage, message.member.displayName, message.content);

      try {
        models.ErrorLog.create({
          errormessage: errorMessage,
          errorTriggeredBy: userId,
        });
        this.message.reply('An error occurred and was logged.');

        return 'Error logged.';
      } catch (e) {
        util.log(errorMessage);
        return this.message.reply('An error occurred but was not logged due to an issue with the underlying database.');
      }
    }
    return this.message.reply(errorMessage);
  }

  // Execute the command's functionality
  run() {
    // Loop through each command and map to key
    util.log('Looping through controller commands', 0);
    Object.keys(this.commands).map((key) => {
      // If command matches message
      if (this.message.parsed[0].toLowerCase() === this.commands[key].command.toLowerCase()) {
        util.log('Matching command found', this.commands[key].command, 2);

        // If user messages the bot a channel-only command
        if (!this.commands[key].allowInDM && !this.message.guild) {
          return this.onError('Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
        }

        // If non-admin enters admin command
        if (this.commands[key].adminOnly && !isInElevatedRole(this.message.member)) {
          return this.onError('You don\'t have permissions to run this command.');
        }

        // Execute command's action
        const commandResponse = this.commands[key].action();
        // Handle if command responds or breaks
        if (commandResponse) {
          this.onSuccess(commandResponse, this.commands[key]);
        } else {
          this.onError('A system-level error occurred.', this.message.member.id, this.message);
        }
      }
      return this.commands[key];
    });
  }
}
module.exports = BaseController;
