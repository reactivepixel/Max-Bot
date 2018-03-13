module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Members', 'messagesCount', {
    type: Sequelize.INTEGER,
  }),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn('Members', 'messagesCount'),
};
