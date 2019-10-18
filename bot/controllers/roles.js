const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

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
      'Admin', 'Armada Officers', 'Armada Officer', 'Fleet Officer',
      'Moderator', 'Tester', 'Team Captain', 'Full Sail Staff', 'Privateers',
      'Team Liaison', 'Armada Athlete', '@everyone', 'Crew',
      'Overwatch_V', 'Overwatch_JV',
      'CS:GO_V', 'CS:GO_JV',
      'Smite_V', 'Smite_JV',
      'Fortnite_V', 'Fortnite_JV',
      'Madden_V', 'Madden_JV',
      'LoL_V', 'LoL_JV',
      'SuperSmashBros_V', 'SuperSmashBros_JV',
      'HeroesOfTheStorm_V', 'HeroesOfTheStorm_JV',
      'RocketLeague_V', 'RocketLeague_JV',
      'DragonBall_V', 'DragonBall_JV',
      'Hearthstone_V', 'Hearthstone_JV',
    ];
  }

  // Lists all roles
  rolesAction() {
    const { message, disallowedRoles } = this;
    const roles = [];
    message.guild.roles.map((role) => {
      if (!disallowedRoles.includes(role.name)) {
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
    } else if (disallowedRoles.includes(targetRole.name)) {
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
      if (!disallowedRoles.includes(role)) {
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
    if (disallowedRoles.includes(targetRole.name)) {
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
      if (!disallowedRoles.includes(role.name)) {
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
      if (!disallowedRoles.includes(role.name)) {
        return message.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Removing all roles. Back to basics.';
  }
}

module.exports = RoleController;
