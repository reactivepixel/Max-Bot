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
        this.name = 'WelcomeNewMember',
        this.description = 'Sends the Welcome Message to New Members',
        this.action = this.welcomeAction.bind(controller),
      ),
      new Event(
        this.event = 'guildMemberAdd',
        this.name = 'AnnoyNewMember',
        this.description = 'Sends an Annoying Message to New Members',
        this.action = this.annoyAction.bind(controller),
      ),
    ];
  }

  welcomeAction() {
    const member = this.eventObj;
    member.user.send('Hello');
  }

  annoyAction() {
    const member = this.eventObj;
    member.user.send('MUAHAHAHAHAHAAHAHA');
  }
}

module.exports = GuildMemberAddEvent;
