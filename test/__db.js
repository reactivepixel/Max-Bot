const models = require('../db/models');

models.Member.findAll().then(console.log).catch(console.error);
