const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');

class WelcomeController extends BaseController {
  constructor(message) {
    super(message);
    const controller = this;
    this.commands = [

    ];
  }

module.exports = WelcomeController;
