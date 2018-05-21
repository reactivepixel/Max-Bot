const BaseController = require('../baseController.js');
const Event = require('../baseEvent.js');

class PresenceUpdateController extends BaseController {
  constructor(member) {
    super(member);
    const controller = this;
    this.eventName = 'presenceUpdate';
    // Array of Events to fire
    this.events = [
      new Event(
        this.event = 'presence',
        this.name = 'PresenceMessenger',
        this.description = 'Sends a message to the user with the presence change',
        this.action = this.sendMessage.bind(controller),
      ),
    ];
  }

  // TESTING: Sends a presence change message to the user
  sendMessage() {
    const { eventObj } = this;
    return eventObj.send('You\'re presence has changed!');
  }
}

module.exports = PresenceUpdateController;
