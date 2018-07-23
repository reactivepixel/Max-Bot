module.exports = {
  up: (queryInterface, Sequelize) => {
    const response = queryInterface.addColumn('Members', 'processed', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    });

    return response;
  },

  down: (queryInterface) => {
    const response = queryInterface.removeColumn('Members', 'processed');

    return response;
  },
};
