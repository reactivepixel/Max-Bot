module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const ctrls = [
      {
        cmd: '!test',
        example: '!test <channel_name>,<channel_name>,<channel_name>',
        title: 'Msg Multiple Specific Channels',
        desc: 'Msg multiple specific channels. Channels are case-sensitive.',
        showWithHelp: true,
        posTargetUser: null,
        posSecondaryCmd: null,
        regexSplitCharacter: null,
        allowInDM: false,
        resType: 'reply',
        action: (message, ctrl, msg) => {

          const targetChannel = message.guild.channels.find('name', 'channel_name').sendMessage('testmsg');

          const roles = msg.parsed[1].split(',');
          util.log('Multiple Roles Parsing', roles, 4);

          roles.map((role) => {
            if (!disallowedRoles.includes(role.toLowerCase())) {
              const targetRole = message.guild.roles.find('name', role);
              util.log('Asking API for Role', targetRole, 4);

              if (targetRole === null) {
                return '"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
              }
              return message.member.addRole(targetRole).catch(util.log);
            }
            return role.name;
          });

          return 'All set!';
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
