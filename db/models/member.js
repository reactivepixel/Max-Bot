

module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define('Member', {
    discorduser: DataTypes.STRING,
    email: DataTypes.STRING,
    uuid: DataTypes.STRING,
    verified: DataTypes.BOOLEAN,
    messagesCount: DataTypes.INTEGER,
    points: DataTypes.INTEGER,

  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        console.log(models);
      },
    },
  });
  return Member;
};
