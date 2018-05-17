class BaseEvent {
  constructor(event, name, action) {
    this.event = event;
    this.name = name;
    this.action = action;
  }
}

module.exports = BaseEvent;
