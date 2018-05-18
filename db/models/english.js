module.exports = (sequelize, DataTypes) => {
  const English = sequelize.define('English', {
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
  return English;
};
