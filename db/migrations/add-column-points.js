module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn('Members', 'points', {
      type: Sequelize.DOUBLE,
    }),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn('Members', 'points'),
};
