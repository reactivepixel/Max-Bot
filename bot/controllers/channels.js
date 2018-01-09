module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const ctrls = [
      {
        cmd: '!channels',
        example: '!channels',
        title: 'List All Channels',
        desc: 'List all Armada Channels',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'dm',
        action: (message) => {
          const channels = [];
          util.log('help!', message);
          message.guild.channels.map((channel) => {
            return channel.name;
          });
          return 'List of all Armada Channels: \n\n' + channels.join('\n');
        },
      },
      {
        cmd: '!notifyTheOthers',
        example: '!notifyTheOthers <channel_name>, <message>',
        title: 'Add a message to another channel',
        desc: 'Type the command, the channel name, and then the message you would like to send.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {
          const channels = msg.parsed[1].split(',');
          channels.map((channel) => {
            const targetChannel = message.guild.channels.find('name', channel);

            if (targetChannel === null) {
              return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all Channels (They are case-sensitive)';
            }
            let fullComment = '';
            // Hey, there's a chance comments can have only one word!
            if (msg.parsed.length > 3) {
              // Add each word to the fullComment variable and send it all together
              // Since the first two in the array are not needed, slice them out
              msg.parsed.slice(2).forEach((string) => {
                fullComment += string + ' ';
              });
            }
            return targetChannel.send(fullComment);
          });
          return 'The Others have been notified. Godspeed, dear message.';
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
