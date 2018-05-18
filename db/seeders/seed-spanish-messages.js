'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Spanish', [{
      msgtype: 'help',
      message: 'v1.4.0 Comandos descubiertos:\n\n\t**<> -  Artículo requerido\t\t[] - Artículo opcional**',
    }, {
      msgtype: 'channel',
      message: 'Enumera todos los canales de Armada disponibles.',
    }, {
      msgtype: 'announce',
      message: 'Transmitir a múltiples canales. Los canales distinguen mayúsculas de minúsculas.',
    }, {
      msgtype: 'roles',
      message: 'Enumera todos los roles de Armada disponibles.',
    }, {
      msgtype: 'addRole',
      message: 'Agregue una sola función para usted. El rol es sensible a mayúsculas y minúsculas.',
    }, {
      msgtype: 'addRoles',
      message: 'Agregue múltiples roles a usted mismo. Rolea distingue entre mayúsculas y minúsculas.',
    }, {
      msgtype: 'removeRole',
      message: 'Elimina una sola función de ti mismo. El rol es sensible a mayúsculas y minúsculas.',
    }, {
      msgtype: 'addAllRoles',
      message: 'Agrega todas las funciones del juego a ti mismo.',
    }, {
      msgtype: 'removeAllRoles',
      message: 'Elimina cada función del juego de ti mismo.',
    }, {
      msgtype: 'verify',
      message: 'Verifique su dirección de correo electrónico de Full Sail. Debe ser @student.fullsail.edu o @fullsail.com.',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Spanish', null, {});
  },
};
