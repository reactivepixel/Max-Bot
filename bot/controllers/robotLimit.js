module.exports = () => {
  // const util = require('apex-util');
  const messageMiddleware = (message) => {
    const container = {};
    container.parsed = message.content.split(' ');
    const msg = Object.assign(message, container);
    return msg;
  };
  // Silly secret command.
  const _commands = (message) => {
    const msg = messageMiddleware(message);
    if (msg.content.toLowerCase() === '!limitless') {
      message.reply({ embed: {
        color: 3447003,
        author: {
          name: 'Max-Bot',
        },
        title: 'Oh no I think I\'ve had a few too many shots of oil...! ',
        url: 'http://boyslife.org/about-scouts/merit-badge-resources/robotics/19223/robot-jokes/',
        description: 'I feel dizzy and silly enjoy these jokes',
        fields: [{
          name: 'A book never written:',
          value: '“Artificial Intelligence” by Anne Droid.',
        },
        {
          name: 'Why was the robot angry?',
          value: 'Because someone kept pushing his buttons!',
        },
        {
          name: 'What is a robot\'s favorite type of music?',
          value: 'Heavy metal! ',
        },
        {
          name: 'How many robots does it take to screw in a light bulb?',
          value: 'Three — one to hold the bulb, and two to turn the ladder!',
        },
        {
          name: 'Why did the robot go back to robot school?',
          value: 'Because his skills were getting a little rusty!',
        },
        {
          name: 'What do you get when you cross a robot and a tractor?',
          value: 'A trans-farmer!',
        },
        {
          name: 'What did the man say to his dead robot?',
          value: '“Rust in peace.”',
        },
        ],
        timestamp: new Date(),
        footer: {
          text: 'Max-Bot',
        },
      },
      });
    }
    return false;
  };
  return {
    commands: _commands,

  };
};
