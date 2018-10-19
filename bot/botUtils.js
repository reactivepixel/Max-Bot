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
    'Moderator', 'Tester', 'Team Captain', 'Full Sail Staff',
    'Team Liaison', 'Armada Athlete', '@everyone', 'Crew',
    'Overwatch_V', 'Overwatch_JV',
    'CS:GO_V', 'CS:GO_JV',
    'Smite_V', 'Smite_JV',
    'Fortnite_V', 'Fortnite_JV',
    'Madden_V', 'Madden_JV',
    'LoL_V', 'LoL_JV',
    'SuperSmashBros_V', 'SuperSmashBros_JV',
    'HeroesOfTheStorm_V', 'HeroesOfTheStorm_JV',
    'RocketLeague_V', 'RocketLeague_JV',
    'DragonBall_V', 'DragonBall_JV',
    'Hearthstone_V', 'Hearthstone_JV',
  ];
  if (adminRoles.some(role => member.roles.find('name', role))) {
    return true;
  }
  return false;
};
