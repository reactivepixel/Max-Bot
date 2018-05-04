module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const ctrls = [{
      cmd: '!addGame',
      example: '!addGame <game_name>',
      title: 'Add Game',
      desc: 'Add a single game to yourself. game is case-sensitive.',
      showWithHelp: true,
      posTargetUser: null,
      posSecondaryCmd: null,
      regexSplitCharacter: null,
      allowInDM: false,
      resType: 'reply',
      action: (message, ctrl, msg) => {
        const makeTextChannel = (message) => {
          const server = message.guild;
          const name = message.author.username;

          server.createChannel(name, 'text');
        };

        return {
          textchannel: makeTextChannel,
        };
      }// action
    }];
    const onSuccess = (message, res, ctrl) => {
      if (res !== null) {
        if (ctrl.resType === 'reply') {
          return message.reply(res);
        } else if (ctrl.resType === 'dm') {
          return message.author.send(res);
        }
      }
      // Fail Safe
      return false;
    };

    const onError = message => message.reply('Sorry I could not process your request would you like to try again.');

    const messageMiddleware = (message) => {
      const container = {};
      container.parsed = message.content.split(' ');
      const msg = Object.assign(message, container);
      return msg;
    };

    ctrls.map((ctrl) => {
      util.log('Running through controller', ctrl.cmd, 2);

      const msg = messageMiddleware(message);
      if (msg.parsed[0].toLowerCase() === ctrl.cmd.toLowerCase()) {
        util.log('!!! Matched Ctrl to Cmd !!!', ctrl.cmd, 2);

        // Ensure the communication is happening on a server
        if (!ctrl.allowInDM) {
          if (!message.guild) return onError(message, 'Please don\'t use this command directly. Instead use it in a channel on a server. :beers:');
        }

        // Do Stuff
        const res = ctrl.action(message, ctrl, msg);
        if (res) {
          onSuccess(message, res, ctrl);
        } else {
          onError(message, res, ctrl);
        }
      }
      return ctrl;
    });
    // end of ctrl
  };// end of run
  return {
    run: _run,
  };
};// end of exports
