const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class RoleController extends BaseController {
  constructor(eventObj) {
    // Call BaseController constructor
    super(eventObj);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!roles',
        '!roles',
        'List All Roles',
        'List all available Armada roles.',
        this.rolesAction.bind(controller),
        'dm',
      ),
      new Command(
        '!addRole',
        '!addRole <role_name>',
        'Add Role',
        'Add a single role to yourself. Role is case-sensitive.',
        this.addRoleAction.bind(controller),
      ),
      new Command(
        '!addRoles',
        '!addRoles <role_name>,[role_name]',
        'Add Multiple Roles',
        'Add multiple roles to yourself. Rolea are case-sensitive.',
        this.addRolesAction.bind(controller),
      ),
      new Command(
        '!removeRole',
        '!removeRole <role_name>',
        'Remove Role',
        'Remove a single role from yourself. Role is case-sensitive.',
        this.removeRoleAction.bind(controller),
      ),
      new Command(
        '!addAllRoles',
        '!addAllRoles',
        'Add All Roles',
        'Add every game role to yourself.',
        this.addAllRolesAction.bind(controller),
      ),
      new Command(
        '!removeAllRoles',
        '!removeAllRoles',
        'Remove All Roles',
        'Remove every game role from yourself.',
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
    const { eventObj, disallowedRoles } = this;
    const roles = [];
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return roles.push(role.name);
      }
      return role.name;
    });
    return 'List of all Armada Roles: \n\n' + roles.join('\n');
  }

  // Adds a role to the user
  addRoleAction() {
    const { eventObj, disallowedRoles } = this;
    const targetRole = eventObj.guild.roles.find('name', eventObj.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', eventObj.parsed[1], 2);
      return '"' + eventObj.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You are not worthy of the role ' + eventObj.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      eventObj.member.addRole(targetRole).catch(util.log);
      return 'Added the role "' + targetRole.name + '".';
    }
  }

  // Adds multiple roles to the user
  addRolesAction() {
    const { eventObj, disallowedRoles } = this;
    const roles = eventObj.parsed[1].split(',');
    util.log('Multiple Roles Parsing', roles, 4);

    roles.map((role) => {
      if (!disallowedRoles.includes(role.toLowerCase())) {
        const targetRole = eventObj.guild.roles.find('name', role);
        util.log('Asking API for Role', targetRole, 4);

        if (targetRole === null) {
          return '"' + role + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
        }
        return eventObj.member.addRole(targetRole).catch(util.log);
      }
      return role.name;
    });

    return 'All set!';
  }

  // Removes role from user
  removeRoleAction() {
    const { eventObj, disallowedRoles } = this;
    const targetRole = eventObj.guild.roles.find('name', eventObj.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', eventObj.parsed[1], 2);
      return '"' + eventObj.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    }
    if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You have not the power or the will to control this power.';
    }

    util.log('Removing role from user', targetRole.name, 2);
    eventObj.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + ' removed.';
  }

  // Adds all roles to user
  addAllRolesAction() {
    const { eventObj, disallowedRoles } = this;
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return eventObj.member.addRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
  }

  // Removes all roles from user
  removeAllRolesAction() {
    const { eventObj, disallowedRoles } = this;
    eventObj.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name.toLowerCase())) {
        return eventObj.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Removing all roles. Back to basics.';
  }
}

module.exports = RoleController;
