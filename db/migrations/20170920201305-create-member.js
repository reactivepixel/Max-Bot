module.exports = {
  up: (queryInterface, Sequelize) => {
    const response = queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      discorduser: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      uuid: {
        type: Sequelize.STRING,
      },
      verified: {
        type: Sequelize.BOOLEAN,
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
    const response = queryInterface.dropTable('Members');

    return response;
  },
};
