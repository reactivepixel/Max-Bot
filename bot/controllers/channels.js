module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const ctrls = [
      {
        cmd: '!chnl',
        example: '!chnl <channel_name>,<channel_name>,<message>',
        title: 'Msg Multiple Specific Channels',
        desc: 'Msg multiple specific channels. Channels are case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {
          const chnls = msg.parsed[1].split(',');
          util.log('Multiple Channels Parsing', chnls, 4);

          chnls.map((chnl) => {
            const targetChnl = message.guild.channels.find('name', chnl);
            util.log('Asking API for Channel', targetChnl, 4);

            if (targetChnl === null) {
              return '"' + chnl + '" is not a known channel. Check text channels on the left to see what channels are available (They are case-sensitive)';
            }
            const msgs = msg.parsed;
            return targetChnl.send(msgs.toString());
          });

          return 'Your message was sent!';
        },
      },
    ];

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

    const onError = message => message.reply('I Broke... Beep...Boop...Beep');

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
  };

  return {
    run: _run,
  };
};
