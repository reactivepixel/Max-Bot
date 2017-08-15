const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log('I am ready!');
});

client.on('message', message => {
  if (message.content.charAt(0) === '!') {
    // message.reply('pong');
    //Find out what command was initiated
    const splitInput = message.content.split(' ');

    // match first command with the database
    //splitInput[0]

    if(splitInput[0].toLowerCase() === '!addrole'){
      // Add roll position 2 to user @ position 3

      let targetRole = message.guild.roles.find('name', splitInput[1])
      if(targetRole === null){
        return message.reply('"' + splitInput[1] + '" is not a known role.')
      }
      let targetMember = message.mentions.members.first();

      targetMember.addRole(targetRole).catch(console.error);
      message.reply(targetRole.name + ' added to ' + targetMember.user.username);
    }

    if(splitInput[0].toLowerCase() === '!removerole'){
      // Add roll position 2 to user @ position 3

      let targetRole = message.guild.roles.find('name', splitInput[1])
      if(targetRole === null){
        return message.reply('"' + splitInput[1] + '" is not a known role.')
      }
      let targetMember = message.mentions.members.first();

      targetMember.removeRole(targetRole).catch(console.error);

      message.reply(targetRole.name + ' removed from ' + targetMember.user.username);
    }

  }
});

client.login(process.env.TOKEN);
