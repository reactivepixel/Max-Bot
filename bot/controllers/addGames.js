// module.exports = () => {
// const util = require('apex-util');
//
// const _run = (message) => {
//     const disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
//     const ctrls = [{
//       cmd: '!addGame',
//       example: '!addGame <game_name>',
//       title: 'Add Game',
//       desc: 'Add a single game to yourself. game is case-sensitive.',
//       showWithHelp: true,
//       posTargetUser: null,
//       posSecondaryCmd: null,
//       regexSplitCharacter: null,
//       allowInDM: false,
//       resType: 'reply',
//       action: (message,ctrl,msg) => {
//       const makeChannel = (message) => {
//           const server = message.guild;
//           const name = message.author.username;
//
//           server.createChannel(name, 'text');
//         };
//       }
//     }];
//   };
//   return {
//     run: _run,
//   };
// };
