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
      new Event(
        this.event = 'guildMemberAdd',
        this.name = 'SendNewMemberTOS',
        this.description = 'Sends the New Member the TOS',
        this.action = this.tosAction.bind(controller),
      ),
    ];
  }

  welcomeAction() {
    const { eventObj } = this;
    eventObj.user.send('Hello');
  }

  annoyAction() {
    const { eventObj } = this;
    eventObj.user.send('MUAHAHAHAHAHAAHAHA');
  }
}

module.exports = GuildMemberAddEvent;
