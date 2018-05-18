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
      new Event(
        this.event = 'guildMemberAdd',
        this.name = 'annoyNewGuildMember',
        this.action = this.annoyAction.bind(controller),
      ),
    ];
  }

  welcomeAction() {
    const { eventObj } = this;
    console.log('THE MEMBER IS: ', eventObj);
    eventObj.user.send('Hello');
  }

  annoyAction() {
    const { eventObj } = this;
    eventObj.user.send('MUAHAHAHAHAHAAHAHA');
  }
}

module.exports = GuildMemberAddEvent;
