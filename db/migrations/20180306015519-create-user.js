

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      discorduser: {
        type: Sequelize.STRING,
      },
      uuid: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      points: {
        type: Sequelize.INTEGER,
      },
      messages: {
        type: Sequelize.INTEGER,
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
    }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Members'),
};
