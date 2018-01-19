class BaseCommand {
  constructor(command, example, title, desc, action, resType = 'reply', showWithHelp = true, allowInDM = false) {
    this.command = command;
    this.example = example;
    this.title = title;
    this.desc = desc;
    this.showWithHelp = showWithHelp;
    this.allowInDM = allowInDM;
    this.resType = resType;
    this.action = action;
  }
}
module.exports = BaseCommand;
