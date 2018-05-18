class BaseEvent {
  constructor(event, name, description, action) {
    this.event = event;
    this.name = name;
    this.description = description;
    this.action = action;
  }
}

module.exports = BaseEvent;
