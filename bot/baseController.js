const util = require('apex-util');
const { isAdmin } = require('./botUtils.js');

class BaseController {
  constructor(eventObj) {
    // Add middleware to saved eventObj
    this.eventObj = BaseController.eventMiddleware(eventObj);
    this.commands = [];
  }

  // Add extra information to eventObj object
  static eventMiddleware(eventObj) {
    // EVENT OBJECT: MESSAGE
    if (eventObj.constructor.name.toLowerCase() === 'message') {
      // Creates an empty object container
      const eventObjContainer = {};
      // Tokenizes the eventObj by space characters, adds to container
      eventObjContainer.parsed = eventObj.content.split(' ');
      // Adds eventObj object to container
      return Object.assign(eventObj, eventObjContainer);
    }
    // EVENT OBJECT: MEMBER
    return eventObj;
  }

  onSuccess(commandResponse, command) {
    if (commandResponse !== null) {
      // Determine how to respond to eventObj
      if (command.responseType === 'reply') {
        return this.eventObj.reply(commandResponse);
      } else if (command.responseType === 'dm') {
        return this.eventObj.author.send(commandResponse);
      }
    }
    // Fail safe
    return false;
  }

  onError(errorMessage = 'I Broke... Beep...Boop...Beep') {
    return this.eventObj.reply(errorMessage);
  }

  // Execute the command's functionality
  run() {
    // EVENT OBJECT: MESSAGE
    if (this.commands) {
      // Loop through each command and map to key
      util.log('Looping through controller commands', 0);
      Object.keys(this.commands).map((key) => {
        // If command matches eventObj
        if (this.eventObj.parsed[0].toLowerCase() === this.commands[key].command.toLowerCase()) {
          util.log('Matching command found', this.commands[key].command, 2);

          // If user eventObjs the bot a channel-only command
          if (!this.commands[key].allowInDM && !this.eventObj.guild) {
            return this.onError('Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
          }

          // If non-admin enters admin command
          if (this.commands[key].adminOnly && !isAdmin(this.eventObj.member)) {
            return this.onError('You don\'t have permissions to run this command.');
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
    // EVENT OBJECT: MEMBER
    return this.action;
  }
}
module.exports = BaseController;
