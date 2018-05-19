const BaseController = require('../baseController.js');
const Event = require('../baseEvent.js');

class GuildMemberAddEvent extends BaseController {
  constructor(member) {
    super(member);
    const controller = this;
    // Array of Events to fire
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

  // TESTING: Sends a hello message to the user
  welcomeAction() {
    const { eventObj } = this;
    return eventObj.user.send('Hello');
  }

  // TESTING: Sends an annoying message to the user
  annoyAction() {
    const { eventObj } = this;
    return eventObj.user.send('MUAHAHAHAHAHAAHAHA');
  }
}

module.exports = GuildMemberAddEvent;
