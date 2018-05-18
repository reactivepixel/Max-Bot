'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Alien', [{
      msgtype: 'help',
      message: 'v1.4.0 awkjfnawkjf akjwnkawjkajwnf:\n\n\t**<> - awjnajwnflaknwf awjn\t\t[] - akwjnfkawjnf ajwfh**',
    }, {
      msgtype: 'channel',
      message: 'Fawjf akjwbg kejawbgkjw kajebg sjhgrg.',
    }, {
      msgtype: 'announce',
      message: 'Kkeugbwekg aweg wegwegwe qwhjqf. qkjwbfkqjbg akqjwbfqre qkjb-qkwjbqkjwbg.',
    }, {
      msgtype: 'roles',
      message: 'Aaskfjbaw awf akjebgkej akwjbf khchd.',
    }, {
      msgtype: 'addRole',
      message: 'Tlh jkb akjsfb lekjbg slekg akwjfb. awgjb ialwkgs akw-akwjbg.',
    }, {
      msgtype: 'addRoles',
      message: 'Hakj alwkbg akwbg takejg akgjwb. alwbg alwbg kajwv-kjwav.',
    }, {
      msgtype: 'removeRole',
      message: 'Kiuwegb awgjh aklwbg kaejgh akjg akwjfv. akwjfb akwufv awkjg-akwjg.',
    }, {
      msgtype: 'addAllRoles',
      message: 'Iakwjgb awli qowig liwfg alwglakwg.',
    }, {
      msgtype: 'removeAllRoles',
      message: 'Oalkwbg awkur ewgkj awkjbf wekhgv alsigf.',
    }, {
      msgtype: 'verify',
      message: 'Eaiuwbg akwu alwkjg wakjg akwjf aqiuwy. qwoigb qw @wke.eiowbg.weg wy @wkjwlt.com.',
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Alien', null, {});
  },
};
