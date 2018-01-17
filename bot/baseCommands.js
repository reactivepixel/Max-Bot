// Base Command class, cleans up classes.
class BaseCommand {
  constructor(cmd, example, title, desc, resType = 'reply', showWithHelp = true, allowInDM = false) {
    this.cmd = cmd;
    this.example = example;
    this.title = title;
    this.desc = desc;
    this.showWithHelp = showWithHelp;
    this.allowInDM = allowInDM;
    this.resType = resType;
    this.action = message => message;
  }
}

module.exports = BaseCommand;
