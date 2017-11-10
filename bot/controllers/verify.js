module.exports = () => {
  const util = require('apex-util');

  const _run = (message) => {
    const ctrls = [{
      cmd: '!verify',
      example: '!verify <email_address>',
      title: 'Verify Email Address',
      desc: 'Verify user\'s email address',
      showWithHelp: true,
      posTargetUser: null,
      posSecondaryCmd: null,
      regexSplitCharacter: null,
      allowInDM: false,
      resType: 'reply',
      action: (message, ctrl, msg) => {
        const validDomains = ['student.fullsail.edu', 'fullsail.edu'];
        const email = msg.parsed[1].toLowerCase();
        const emailDomain = email.split('@').pop();
        // Method to generate random numeric verification code
        // Modified to fit style guide from this SO answer:
        // https://stackoverflow.com/a/39774334
        const generateCode = (n) => {
          const add = 1;
          let max = 12 - add;
          let min = 0;
          if (n > max) {
            return generateCode(max) + generateCode(n - max);
          }
          // max = 10 ** (n + add);
          max = 10000000;
          min = max / 10;
          const number = Math.floor(Math.random() * (max - (min + 1))) + min;
          return ('' + number).substring(add);
        };
        // We can set `codeLength` to whatever length we want the verif code to be.
        // Recommend ngt 8 digits.
        if (validDomains.includes(emailDomain)) {
          const codeLength = 6;
          const code = generateCode(codeLength);
          // TODO: Set `time` prop to 600000 (10min)
          const collector = message.channel.createMessageCollector(
            m => m.content.includes(code),
            // 15000ms only for testing!!!
            { time: 15000 });
          collector.on('collect', (m) => {
            util.log('Collected', m.content, 3);
            // TODO: Database integration/email verif process
            message.reply('Thanks! I\'ll get to work adding you the servers right away!');
          });
          collector.on('end', (collected) => {
            util.log('Items', collected.size, 3);
            if (collected.size === 0) {
              // TODO: ping admin team on verification fail
              message.reply('Uh-oh, it looks like you weren\'t able to get the right verification code back to me in time. I\'ve contacted the Armada admins so we can get this straightened out right away.');
            }
          });
          // TODO: Email generated code to supplied email address `email` (remove util.log?)
          util.log('Code', code, 3);
          return `Hi there, it looks like you're trying to verify your email address!\n\nBeep boop... generating verification code... beep boop\n\nI've emailed a ${codeLength}-digit number to _${email}_. Respond back with that number within 10 minutes and I'll automagically verify your email address so you can represent the glorious Full Sail Armada!`;
        } else {
          return 'Sorry, I can only verify Full Sail University email addresses.';
        }
      },
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
