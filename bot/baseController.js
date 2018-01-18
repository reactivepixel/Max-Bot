const util = require('apex-util');

class BaseController {
  constructor(message) {
    this.message = message;
    this.ctrls = [];
  }

  onSuccess(res, ctrl) {
    if (res !== null) {
      if (ctrl.resType === 'reply') {
        return this.message.reply(res);
      } else if (ctrl.resType === 'dm') {
        return this.message.author.send(res);
      }
    }
    // Fail Safe
    return false;
  }

  // Not sure why error method accepted 3 params in "Do Stuff".
  onError() {
    this.message.reply('I Broke... Beep...Boop...Beep');
  }

  messageMiddleware() {
    const container = {};
    container.parsed = this.message.content.split(' ');
    const msg = Object.assign(this.message, container);
    return msg;
  }

  run() {
    this.ctrls.map((ctrl) => {
      util.log('Running through controller', ctrl.cmd, 2);

      const msg = this.messageMiddleware();
      if (msg.parsed[0].toLowerCase() === ctrl.cmd.toLowerCase()) {
        util.log('!!! Matched Ctrl to Cmd !!!', ctrl.cmd, 2);

        // Ensure the communication is happening on a server
        if (!ctrl.allowInDM) {
          if (!this.message.guild) return this.onError('Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
        }

        // Do Stuff
        const res = ctrl.action(this.message, msg);
        if (res) {
          this.onSuccess(res, ctrl);
        } else {
          this.onError();
        }
      }
      return ctrl;
    });
  }
}
module.exports = BaseController;
