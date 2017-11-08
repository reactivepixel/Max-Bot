'use strict';
module.exports = (sequelize, DataTypes) => {
  var Member = sequelize.define('Member', {
    discorduser: DataTypes.STRING,
    email: DataTypes.STRING,
    uuid: DataTypes.STRING,
    verified: DataTypes.BOOLEAN
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Member;
};