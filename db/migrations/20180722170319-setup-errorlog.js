
module.exports = {
  up: (queryInterface, Sequelize) => {
    const response = queryInterface.createTable('ErrorLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      errormessage: {
        type: Sequelize.STRING,
      },
      errorTriggeredBy: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    });

    return response;
  },
  down: (queryInterface) => {
    const response = queryInterface.dropTable('ErrorLogs');
    return response;
  },
};
