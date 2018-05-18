'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('English', [{
      msgtype: 'help',
      message: 'v1.4.0 Discovered Commands:\n\n\t**<> - Required Item\t\t[] - Optional Item**',
    }, {
      msgtype: 'channel',
      message: 'List all available Armada channels.',
    }, {
      msgtype: 'announce',
      message: 'Broadcast to multiple channels. Channels are case-sensitive.',
    }, {
      msgtype: 'roles',
      message: 'List all available Armada roles.',
    }, {
      msgtype: 'addRole',
      message: 'Add a single role to yourself. Role is case-sensitive.',
    }, {
      msgtype: 'addRoles',
      message: 'Add multiple roles to yourself. Rolea are case-sensitive.',
    }, {
      msgtype: 'removeRole',
      message: 'Remove a single role from yourself. Role is case-sensitive.',
    }, {
      msgtype: 'addAllRoles',
      message: 'List all available Armada channels.',
    }, {
      msgtype: 'removeAllRoles',
      message: 'Remove every game role from yourself.',
    }, {
      msgtype: 'verify',
      message: 'Verify your Full Sail email address. Must be @student.fullsail.edu or @fullsail.com.',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('English', null, {});
  },
};
