const utils = require('apex-util');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    discorduser: DataTypes.STRING,
    email: DataTypes.STRING,
    points: DataTypes.STRING,
    messages: DataTypes.INTEGER,
    verified: DataTypes.BOOLEAN,
  }, {});
  User.associate = (models) => {
    // associations can be defined here
    utils.log('member models/user :', models, 3);
  };
  return User;
};
