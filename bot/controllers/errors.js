const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const nodemailer = require('nodemailer');
const { generateCode } = require('../botUtils.js');

class VerifyController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!showErrors',
        '!showErrors',
        'Present Bot Errors',
        'If enabled, bot errors will be sent to you via dm.',
        this.showErrors.bind(controller),
      ),
    ];
  }

  // Enables or disables error presentation to use with correct role.
  showErrors() {
    const { message } = this;

    let IS_ADMIN = message.member.hasPermission("KICK_MEMBERS")

    if(IS_ADMIN) {
        
    }

    return 'You can now see error messages'
    }
  }
}

module.exports = VerifyController;
