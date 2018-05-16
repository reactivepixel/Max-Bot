const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const Localize = require('localize');

const myLocale = new Localize({
  roles: {
    en: 'List all available Armada roles.',
    es: 'Enumera todos los roles de Armada disponibles.',
    al: 'Aaskfjbaw awf akjebgkej akwjbf khchd.',
  },
  addRole: {
    en: 'Add a single role to yourself. Role is case-sensitive.',
    es: 'Agregue una sola función para usted. El rol es sensible a mayúsculas y minúsculas.',
    al: 'Tlh jkb akjsfb lekjbg slekg akwjfb. awgjb ialwkgs akw-akwjbg.',
  },
  addRoles: {
    en: 'Add multiple roles to yourself. Rolea are case-sensitive.',
    es: 'Agregue múltiples roles a usted mismo. Rolea distingue entre mayúsculas y minúsculas.',
    al: 'Hakj alwkbg akwbg takejg akgjwb. alwbg alwbg kajwv-kjwav.',
  },
  removeRole: {
    en: 'Remove a single role from yourself. Role is case-sensitive.',
    es: 'Elimina una sola función de ti mismo. El rol es sensible a mayúsculas y minúsculas.',
    al: 'Kiuwegb awgjh aklwbg kaejgh akjg akwjfv. akwjfb akwufv awkjg-akwjg.',
  },
  addAllRoles: {
    en: 'List all available Armada channels.',
    es: 'Agrega todas las funciones del juego a ti mismo.',
    al: 'Iakwjgb awli qowig liwfg alwglakwg.',
  },
  removeAllRoles: {
    en: 'Remove every game role from yourself.',
    es: 'Elimina cada función del juego de ti mismo.',
    al: 'Oalkwbg awkur ewgkj awkjbf wekhgv alsigf.',
  },
});
myLocale.setLocale(process.env.LANG);

class RoleController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!roles',
        '!roles',
        'List All Roles',
        myLocale.translate('roles'),
        this.rolesAction.bind(controller),
        'dm',
      ),
      new Command(
        '!addRole',
        '!addRole <role_name>',
        'Add Role',
        myLocale.translate('addRole'),
        this.addRoleAction.bind(controller),
      ),
      new Command(
        '!addRoles',
        '!addRoles <role_name>,[role_name]',
        'Add Multiple Roles',
        myLocale.translate('addRoles'),
        this.addRolesAction.bind(controller),
      ),
      new Command(
        '!removeRole',
        '!removeRole <role_name>',
        'Remove Role',
        myLocale.translate('removeRole'),
        this.removeRoleAction.bind(controller),
      ),
      new Command(
        '!addAllRoles',
        '!addAllRoles',
        'Add All Roles',
        myLocale.translate('addAllRoles'),
        this.addAllRolesAction.bind(controller),
      ),
      new Command(
        '!removeAllRoles',
        '!removeAllRoles',
        'Remove All Roles',
        myLocale.translate('removeAllRoles'),
        this.removeAllRolesAction.bind(controller),
      ),
    ];

    // User roles commands cannot change
    this.disallowedRoles = [
      'admin', 'armada officers', 'armada officer',
      'moderator', 'privateers', 'privateer',
      'tester', 'crew', 'fleet officer', '@everyone',
    ];
  }

  // Lists all roles
  rolesAction() {
    const { message, disallowedRoles } = this;
    const roles = [];
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return roles.push(role.name);
      }
      return role.name;
    });
    return 'List of all Armada Roles: \n\n' + roles.join('\n');
  }

  // Adds a role to the user
  addRoleAction() {
    const { message, disallowedRoles } = this;
    const targetRole = message.guild.roles.find('name', message.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', message.parsed[1], 2);
      return '"' + message.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You are not worthy of the role ' + message.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      message.member.addRole(targetRole).catch(util.log);
      return 'Added the role "' + targetRole.name + '".';
    }
  }

  // Adds multiple roles to the user
  addRolesAction() {
    const { message, disallowedRoles } = this;
    const roles = message.parsed[1].split(',');
    util.log('Multiple Roles Parsing', roles, 4);

    roles.map((role) => {
      if (!disallowedRoles.includes(role.toLowerCase())) {
        const targetRole = message.guild.roles.find('name', role);
        util.log('Asking API for Role', targetRole, 4);

        if (targetRole === null) {
          return '"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
        }
        return message.member.addRole(targetRole).catch(util.log);
      }
      return role.name;
    });

    return 'All set!';
  }

  // Removes role from user
  removeRoleAction() {
    const { message, disallowedRoles } = this;
    const targetRole = message.guild.roles.find('name', message.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', message.parsed[1], 2);
      return '"' + message.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    }
    if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You have not the power or the will to control this power.';
    }

    util.log('Removing role from user', targetRole.name, 2);
    message.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + ' removed.';
  }

  // Adds all roles to user
  addAllRolesAction() {
    const { message, disallowedRoles } = this;
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return message.member.addRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
  }

  // Removes all roles from user
  removeAllRolesAction() {
    const { message, disallowedRoles } = this;
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return message.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Removing all roles. Back to basics.';
  }
}

module.exports = RoleController;
