module.exports = (sequelize, DataTypes) => {
  const Alien = sequelize.define('Alien', {
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
  return Alien;
};
