const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class RoleController extends BaseController {
  constructor(message) {
    super(message);
    this.ctrls = [
      new Command('!roles', '!roles', 'List All Roles', 'List all Armada Roles', this.rolesAction, 'dm'),
      new Command('!addRole', '!addRole <role_name>', 'Add Role', 'Add a single role to yourself. Role is case-sensitive.', this.addRoleAction),
      new Command('!addRoles', '!addRoles <role_name>,<role_name>,<role_name>', 'Add Multiple Specific Roles', 'Add a single role to yourself. Role is case-sensitive.', this.addRolesAction),
      new Command('!removeRole', '!removeRole <role_name>', 'Remove a single role', 'Remove a single game role from yourself. Role is case-sensitive.', this.removeRoleAction),
      new Command('!addAllRoles', '!addAllRoles', 'Add All Roles', 'Add every game role to yourself.', this.addAllRolesAction),
      new Command('!removeAllRoles', '!removeAllRoles', 'Remove All Roles', 'Remove every game role from yourself.', this.removeAllRolesAction),
    ];
    this.disallowedRoles = [];
    this.run();
  }

  rolesAction(message) {
    this.disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    const roles = [];
    util.log('help!', message);
    message.guild.roles.map((role) => {
      if (!this.disallowedRoles.includes(role.name.toLowerCase())) {
        return roles.push(role.name);
      }
      return role.name;
    });
    return 'List of all Armada Roles: \n\n' + roles.join('\n');
  }

  addRoleAction(message, msg) {
    this.disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    const targetRole = message.guild.roles.find('name', msg.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', msg.parsed[1], 2);
      return '"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    } else if (this.disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You are not worthy of the role ' + msg.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      message.member.addRole(targetRole).catch(util.log);
      return 'Added the role "' + targetRole.name + '".';
    }
  }

  addRolesAction(message, msg) {
    this.disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    const roles = msg.parsed[1].split(',');
    util.log('Multiple Roles Parsing', roles, 4);

    roles.map((role) => {
      if (!this.disallowedRoles.includes(role.toLowerCase())) {
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

  removeRoleAction(message, msg) {
    this.disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    const targetRole = message.guild.roles.find('name', msg.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', msg.parsed[1], 2);
      return '"' + msg.parsed[1] + '" is not a known role. Try `!roles` to get a list of all Roles (They are case-sensitive)';
    }
    if (this.disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return 'You have not the power or the will to control this power.';
    }

    util.log('Removing role from user', targetRole.name, 2);
    message.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + ' removed.';
  }

  addAllRolesAction(message) {
    this.disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    message.guild.roles.map((role) => {
      if (!this.disallowedRoles.includes(role.name.toLowerCase())) {
        return message.member.addRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Adding you to all Roles. You\'re going to be drinking from the firehose :sob:';
  }

  removeAllRolesAction(message) {
    this.disallowedRoles = ['admin', 'armada officers', 'armada officer', 'moderator', 'privateers', 'privateer', 'tester', 'crew', 'fleet officer', '@everyone'];
    message.guild.roles.map((role) => {
      if (!this.disallowedRoles.includes(role.name.toLowerCase())) {
        return message.member.removeRole(role).catch(util.log);
      }
      return role.name;
    });

    return 'Removing all roles. Back to basics.';
  }
}

module.exports = RoleController;
