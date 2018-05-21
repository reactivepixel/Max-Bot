const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const msg = require('../locale/messages.json');

const lang = process.env.LANGUAGE;

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
        msg.roles.helpMsg[lang],
        this.rolesAction.bind(controller),
        'dm',
      ),
      new Command(
        '!addRole',
        '!addRole <role_name>',
        'Add Role',
        msg.addRole.helpMsg[lang],
        this.addRoleAction.bind(controller),
      ),
      new Command(
        '!addRoles',
        '!addRoles <role_name>,[role_name]',
        'Add Multiple Roles',
        msg.addRoles.helpMsg[lang],
        this.addRolesAction.bind(controller),
      ),
      new Command(
        '!removeRole',
        '!removeRole <role_name>',
        'Remove Role',
        msg.removeRole.helpMsg[lang],
        this.removeRoleAction.bind(controller),
      ),
      new Command(
        '!addAllRoles',
        '!addAllRoles',
        'Add All Roles',
        msg.addAllRoles.helpMsg[lang],
        this.addAllRolesAction.bind(controller),
      ),
      new Command(
        '!removeAllRoles',
        '!removeAllRoles',
        'Remove All Roles',
        msg.removeAllRoles.helpMsg[lang],
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
    return msg.roles.msg[lang] + roles.join('\n');
  }

  // Adds a role to the user
  addRoleAction() {
    const { message, disallowedRoles } = this;
    const targetRole = message.guild.roles.find('name', message.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', message.parsed[1], 2);
      return '"' + message.parsed[1] + '" ' + msg.addRole.errorMsg[lang];
    } else if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return msg.addRole.deniedMsg[lang] + message.parsed[1] + '.';
    } else {
      util.log('Adding Role to user', targetRole.name, 2);
      message.member.addRole(targetRole).catch(util.log);
      return msg.addRole.successMsg[lang] + '"' + targetRole.name + '".';
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
          return '"' + role + '" ' + msg.addRoles.errorMsg[lang];
        }
        return message.member.addRole(targetRole).catch(util.log);
      }
      return role.name;
    });

    return msg.addRoles.msgReturn[lang];
  }

  // Removes role from user
  removeRoleAction() {
    const { message, disallowedRoles } = this;
    const targetRole = message.guild.roles.find('name', message.parsed[1]);
    if (targetRole === null) {
      util.log('No role matched', message.parsed[1], 2);
      return '"' + message.parsed[1] + '" ' + msg.removeRole.errorMsg[lang];
    }
    if (disallowedRoles.includes(targetRole.name.toLowerCase())) {
      util.log('User Tried to add a restricted/dissalowed role', targetRole.name, 2);
      return msg.removeRole.deniedMsg[lang];
    }

    util.log('Removing role from user', targetRole.name, 2);
    message.member.removeRole(targetRole).catch(util.log);
    return targetRole.name + msg.removeRole.msgReturn[lang];
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

    return msg.addAllRoles.msgReturn[lang];
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

    return msg.removeAllRoles.msgReturn[lang];
  }
}

module.exports = RoleController;
