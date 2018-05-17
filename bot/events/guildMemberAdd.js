const BaseController = require('../baseController.js');
const Event = require('../baseEvent.js');
// const util = require('apex-util');

class ChannelController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.event = [
      new Event(
        this.event = 'guildMemberAdd',
        this.action = this.welcomeAction.bind(controller),
      ),
    ];
  }

  welcomeAction() {
    const { member } = this;
    console.log('THE MEMBER IS: ', member);
  }
}

module.exports = ChannelController;
