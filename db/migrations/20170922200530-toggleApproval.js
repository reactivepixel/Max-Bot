'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Members', 'processed', {
      type: Sequelize.BOOLEAN,
      defaultValue: 0,
      allowNull: false
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Members', 'processed');
  }
};
