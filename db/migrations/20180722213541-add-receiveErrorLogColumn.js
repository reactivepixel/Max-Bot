module.exports = {
  up: (queryInterface, Sequelize) => {
    const response = queryInterface.addColumn('Members', 'receiveErrors', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: false,
    });

    return response;
  },

  down: (queryInterface) => {
    const response = queryInterface.removeColumn('Members', 'receiveErrors');
    return response;
  },
};
