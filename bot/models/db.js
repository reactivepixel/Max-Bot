const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_SCHEMA,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});


const cmd = sequelize.define('cmd', {
  cmd: {
    type: Sequelize.STRING,
  },
  regex: {
    type: Sequelize.STRING,
  },
});

const action = sequelize.define('action', {
  title: {
    type: Sequelize.STRING,
  },
});

cmd.hasMany(action, {
  foreignKey: 'actionID',
});

sequelize.sync();

exports.sequelize = sequelize;
exports.user = cmd;
exports.course = action;
