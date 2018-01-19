const util = require('apex-util');

class BaseController {
  constructor(message) {
    // Add middleware to saved message
    this.message = BaseController.messageMiddleware(message);
    this.commands = [];
    this.adminRoles = [
      'admin', 'armada officers', 'armada officer',
      'moderator', 'tester', 'fleet officer',
    ];
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

  onError(errorMessage = 'I Broke... Beep...Boop...Beep') {
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
        if (this.commands[key].adminOnly && !this.adminRoles.some(role => this.message.member.roles.find('name', role))) {
          return this.onError('Hey there, you don\'t have permissions to run this command.');
        }

        // Execute command's action
        const commandResponse = this.commands[key].action();
        // Handle if command responds or breaks
        if (commandResponse) {
          this.onSuccess(commandResponse, this.commands[key]);
        } else {
          this.onError();
        }
      }
      return this.commands[key];
    });
  }
}
module.exports = BaseController;
