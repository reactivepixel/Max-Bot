

const uuidv4 = require('uuid/v4');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Members', [{
    discorduser: '226894986262740993',
    email: 'chapman@apextion.com',
    uuid: uuidv4(),
    verified: 0,
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Members', null, {}),
};
