const BaseController = require('../baseController.js');
const Event = require('../baseEvent.js');
// const util = require('apex-util');

class GuildMemberAddEvent extends BaseController {
  constructor(member) {
    super(member);
    const controller = this;
    this.events = [
      new Event(
        this.event = 'guildMemberAdd',
        this.name = 'welcomeGuildMember',
        this.action = this.welcomeAction.bind(controller),
      ),
    ];
  }

  welcomeAction() {
    // const { GuildMember } = this;
    console.log('THE MEMBER IS: ', this.member);
  }
}

module.exports = GuildMemberAddEvent;
