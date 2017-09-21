const models = require('../models');
const uuidv4 = require('uuid/v4');

models.Member.create({
  discorduser: '@derp',
  email: 'chapman@apextion.com',
  uuid: uuidv4(),
  verified: 0
}).then(console.log).catch(console.error);
