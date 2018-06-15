/**
 * Created by MasterAnseen on 6/8/18.
 */
const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');

class DetailsController extends BaseController {
    constructor(message) {
        super(message);
        const controller = this;
        this.commands = [
            new Command(
                '!terms',
                '!terms',
                'Resend the Terms of Service',
                'Resend the Terms of Service in direct message.',
                this.channelTerms.bind(controller),
                'dm',
            ),
        ];
    }
    channelTerms() {
        const { username } = this.message.author;
        return 'Hi ' + username + ', here are those terms of service you were looking for!';
    }
}
module.exports = DetailsController;