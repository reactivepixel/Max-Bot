const { Member } = require('../db/models');

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

// Update the user points in the database
exports.getUserPointsandUpdate = async (userId, pointsToAdd) => {
  const memberData = await Member.findAll({ attributes: ['points'], where: { discordUser: userId } });
  await Member.update(
    { points: memberData[0].dataValues.points + pointsToAdd },
    { where: { discordUser: userId } });
};

exports.validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
