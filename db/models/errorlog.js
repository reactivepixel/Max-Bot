module.exports = (sequelize, DataTypes) => {
  const ErrorLog = sequelize.define('ErrorLog', {
    errormessage: DataTypes.STRING,
    errorTriggeredBy: DataTypes.STRING,
  }, {
    classMethods: {
      associate: (models) => {
        // associations can be defined here
        console.log(models);
      },
    },
  });
  return ErrorLog;
};
