module.exports = (sequelize, DataTypes) => {
  const Spanish = sequelize.define('Spanish', {
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
  return Spanish;
};
