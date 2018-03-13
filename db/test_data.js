const models = require('../models');
const uuidv4 = require('uuid/v4');

models.Member.create({
  discorduser: '@fsafas',
  email: 'fasfasaf@apextion.com',
  uuid: uuidv4(),
  verified: 1
}).then(console.log).catch(console.error);
