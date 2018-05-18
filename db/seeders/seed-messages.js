'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Messages', [{
      lang: 'EN',
      msgtype: 'help',
      message: 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**',
    }, {
      lang: 'ES',
      msgtype: 'help',
      message: 'v1.4.0 Comandos descubiertos:\n\n\t**<> -  Artículo requerido\t\t[] - Artículo opcional**',
    }, {
      lang: 'AL',
      msgtype: 'help',
      message: 'v1.4.0 awkjfnawkjf akjwnkawjkajwnf:\n\n\t**<> - awjnajwnflaknwf awjn\t\t[] - akwjnfkawjnf ajwfh**',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Messages', null, {});
  },
};
