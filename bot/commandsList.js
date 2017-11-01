module.exports = [
  {
    cmd: '`!help`',
    desc: 'Displays this menu. Neat.',
  },
  {
    cmd: '`!roles`',
    desc: 'Lists all Armada Roles.',
  },
  {
    cmd: '`!addRole` RoleName',
    desc: 'Adds yourself to a role and the related text/voice rooms.',
  },
  {
    cmd: '`!removeRole` RoleName',
    desc: 'Removes a role from yourself.',
  },
  {
    cmd: '`!addAllRoles`',
    desc: 'Adds all roles to yourself.',
  },
  {
    cmd: '`!removeAllRoles`',
    desc: 'Removes all roles from yourself.',
  },
  {
    cmd: '`!shout` <channels> `--m` Message',
    desc: 'Sends your message to a list of channels separated by spaces (no commas).',
  },
  {
    cmd: '`!shoutall` Message',
    desc: 'Sends your message to _all_ text channels on the server. Use wisely, padawan.',
  },
];
