const BaseController = require('../baseController.js');
const Command = require('../baseCommand.js');
const util = require('apex-util');
const models = require('../../db/models');
const uuidv4 = require('uuid/v4');
const { generateCode, validDomains, sendEmail } = require('../botUtils.js');
const emailTemplate = require('../botUtils');

class VerifyController extends BaseController {
  constructor(message) {
    // Call BaseController constructor
    super(message);

    // Aliasing 'this' as controller to allow for binding in actions
    const controller = this;

    // Array of all commands, see baseCommand.js for prototype
    this.commands = [
      new Command(
        '!verify',
        '!verify <email_address>',
        'Verify Email Address',
        'Verify your Full Sail email address. Must be @student.fullsail.edu or @fullsail.com.',
        this.verifyAction.bind(controller),
      ),
    ];
  }

  // Verifies Full Sail email addresses
  verifyAction() {
    const { message } = this;
    const targetVerifiedRoleName = 'Crew';
    const timeoutInMiliseconds = 600000;
    const email = message.parsed[1].toLowerCase();
    const emailDomain = email.split('@').pop();

    // We can set `codeLength` to whatever length we want the verif code to be.
    // Recommend ngt 8 digits.
    if (validDomains.includes(emailDomain)) {
      const codeLength = 6;
      // code to equal value generated
      const code = generateCode(codeLength);

      util.log('code', code, 3);
      // TODO: Set `time` prop to 600000 (10min)
      const collector = message.channel.createMessageCollector(
        m => m.content.includes(code),
        { time: timeoutInMiliseconds });
      collector.on('collect', (m) => {
        const verifyUser = 'Welcome aboard, Crewmate!';
        const userAlredyOnSystem = 'This email has already been verified to a discord user.';
        models.Member.findOne({ where: { email } }).then((matchedUserData) => {
          if (matchedUserData === null) {
            // no existing record found
            models.Member.create({
              discorduser: m.author.id,
              email,
              uuid: uuidv4(),
              verified: 1,
              points: 1,
            });
            // mapping guild roles to find the crew role id
            const targetRole = message.guild.roles.find('name', targetVerifiedRoleName);
            message.member.addRole(targetRole).catch(util.log);
            message.reply(verifyUser);
          } else {
            // existing record found
            message.reply(userAlredyOnSystem);
          }
        });
        util.log('Collected', m.content, 3);
      });
      collector.on('end', (collected) => {
        const verificationTimeout = `!verify timeout. Clap ${collected.author.username} in irons!  Let's see how well they dance on the plank!`;
        util.log('Items', collected.size, 3);
        if (collected.size === 0) {
          // TODO: ping admin team on verification fail
          message.reply(verificationTimeout);
        }
      });
      const emailType = 'verify';
      const emailSubject = 'Armada Verification Code';
      const templateTop = emailTemplate.templateTop();
      const templateBottom = emailTemplate.templateBottom();
      const emailBodyString = `${templateTop}<table><tr><td><p>Enter the code below into Discord, in the same channel on the Armada Server. Verification will timeout after ${(timeoutInMiliseconds / 1000) / 60} minutes from first entering the !verify command.</p></td></tr><tr><td><h2>Verification Code: ${code}</h2></td></tr></table>${templateBottom}`;
      sendEmail(message, email, emailSubject, emailBodyString, emailType, sendStatus => sendStatus);

      util.log('Code', code, 3);
      return `...What's the passcode? \n\n *eyes you suspicously*\n\n I just sent it to your email, just respond back to this channel within ${(timeoutInMiliseconds / 1000) / 60} minutes, with the code, and I won't treat you like a scurvy cur!`;
    } else {
      return 'Sorry, I can only verify Full Sail University email addresses.';
    }
  }
}

module.exports = VerifyController;
