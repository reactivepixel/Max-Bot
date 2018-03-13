module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Members', 'points', {
      type: Sequelize.INTEGER,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Members', 'points'),
};
