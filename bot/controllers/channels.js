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
          message.guild.channels.map(channel => channels.push(channel.name));
          return 'List of all Armada Channels: \n\n' + channels.join('\n');
        },
      },
      {
        cmd: '!announce',
        example: '!announce <channel_name>,<channel_name>,<channel_name> <message>',
        title: 'Announce to Channels',
        desc: 'Broadcast to multiple specific channels. Channels are case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'dm',
        action: (message, ctrl, msg) => {
          const channels = msg.parsed[1].split(',');
          util.log('Multiple Channels Parsing', channels, 4);

          channels.map((channel) => {
            const targetChannel = message.guild.channels.find('name', channel);
            util.log('Asking API for Channel', targetChannel, 4);

            if (targetChannel === null) {
              return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all Channels (They are case-sensitive)';
            }

            // Set parsed value to 2 for message.
            let msgParsedIndex = 2;
            let preparedMessage = '';

            // Loop through/join user message by space until end.
            while (msgParsedIndex < msg.parsed.length) {
              // Add spaces after first word
              if (msgParsedIndex !== 2) {
                preparedMessage += ' ';
              }
              preparedMessage += msg.parsed[msgParsedIndex];
              msgParsedIndex += 1;
            }
            return targetChannel.send(preparedMessage);
          });

          return 'Broadcast sent!';
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
