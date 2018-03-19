const { Member } = require('../db/models');
const util = require('apex-util');

exports.generateCode = (n) => {
  // Workaround method for Math.pow() and ** operator
  const pow = (base, exp) => {
    let result = 1;
    for (let i = 0; i < exp; i += 1) {
      result *= base;
    }
    return result;
  };
  const add = 1;
  let max = 12 - add;
  let min = 0;
  if (n > max) {
    return this.generateCode(max) + this.generateCode(n - max);
  }
  max = pow(10, n + add);
  min = max / 10;
  const number = Math.floor(Math.random() * (max - (min + 1))) + min;
  return ('' + number).substring(add);
};

// Checks if person is an admin user, use GuildMember object
exports.isAdmin = (member) => {
  const adminRoles = [
    'Admin', 'Armada Officers', 'Armada Officer', 'Fleet Officer',
    'Moderator', 'Tester',
  ];
  if (adminRoles.some(role => member.roles.find('name', role))) {
    return true;
  }
  return false;
};

// Checks if the member has been verified
exports.isVerified = async (userId) => {
  const memberData = await Member.findOne({ attributes: ['verified'], where: { discordUser: userId } });
  if (memberData) {
    return !!memberData.dataValues.verified;
  }
  return false;
};

// Update the user points in the database
exports.getUserPointsandUpdate = async (userId, pointsToAdd) => {
  const memberData = await Member.findAll({ attributes: ['points', 'verified'], where: { discordUser: userId } });
  const { points, verified } = memberData[0].dataValues;
  const pointsBeingAdded = parseFloat((points + pointsToAdd).toFixed(2));
  // Checks to see if the person has verified before adding points.
  verified ? await Member.update(
    { points: pointsBeingAdded },
    { where: { discordUser: userId } }) : util.log('User is not verified', userId, 4);
};

// Using async and await is the only way I could get this to work
// It needed to be forced to wait and go line by line to get the proper data
exports.welcomeCommand = async (member) => {
  const { user } = member;
  util.log('User id', user.id, 4);
  let welcomeString = null;
  const pointsMethods = `
    **How to Earn Points:**
    \n\`Chatting with friends\`
    Chat with others and earn points! Get rewarded for talking to others!
    \n\`Gaming, Streaming, and More!\`
    Be rewarded for engagement through streaming, playing games with others, listening to Spotify, and more!
    \n\`Invite New Members\`
    Invite other students from Full Sail University to the server and be awarded points!
  `;
  // Asnyc await was needed to set the string properly for being verified or not
  await this.isVerified(user.id).then((verified) => {
    if (verified) {
      welcomeString = `Welcome to the server ${user.username}! Start earning points! \n${pointsMethods}`;
    } else {
      welcomeString = `Welcome to the server ${user.username}! Get verified to start earning points! \n${pointsMethods}`;
    }
  });
  await member.send(welcomeString);
};
