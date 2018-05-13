module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define('Messages', {
    lang: DataTypes.STRING,
    msgtype: DataTypes.STRING,
    message: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        console.log(models);
      },
    },
  });
  return Messages;
};
