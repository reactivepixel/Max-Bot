module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const ctrls = [
      {
        // Command to list all available channels
        cmd: '!channels',
        example: '!channels',
        title: 'List All Channels',
        desc: 'List all Armada channels',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'dm',
        action: (message) => {
          const channels = [];
          util.log('help!', message);
          message.guild.channels.map(channel => channels.push(channel.name));
          return 'List of all Armada channels: \n\n' + channels.join('\n');
        },
      },
      {
        // Command to send a message to all specified channels
        cmd: '!alertChannels',
        // **Proper format a MUST otherwise channels left out and message gets cut off
        example: '!alertChannels <channel_name>,<channel_name>,<channel_name> : <message>',
        title: 'Send Message to Multiple Specific Channels',
        desc: 'Message multiple specific channels. Channels are case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {
          // Split msg to obtain requested channels
          const channels = msg.parsed[1].split(',');
          util.log('Multiple Channels Parsing', channels, 4);

          // Map through channels, check each for validity, send message if okay
          channels.map((channel) => {
            const targetChannel = message.guild.channels.find('name', channel);
            util.log('Asking API for Channel', targetChannel, 4);

            if (targetChannel === null) {
              return '"' + channel + '" is not a known channel. Try `!channels` to get a list of all channels (They are case-sensitive)';
            }

            // Obtain only message portion of command and convert to string
            let messages = msg.parsed.slice(3).toString();
            // Replace ',' from initial split and replace with space
            messages = messages.replace(/,/g, ' ');

            // Send compiled message to channel
            return targetChannel.send(messages.toString());
          });

          return 'Alert sent to the following channels: ' + channels;
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
