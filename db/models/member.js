const utils = require('apex-util');

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', { discorduser: DataTypes.STRING,
    email: DataTypes.STRING,
    points: DataTypes.STRING,
    messages: DataTypes.INTEGER,
    verified: DataTypes.BOOLEAN }, {});
  Member.associate = (models) => {
    // associations can be defined here
    utils.log('member models/member :', models, 3);
  };
  return Member;
};
