const { Member } = require('../db/models');
const nodemailer = require('nodemailer');
const util = require('apex-util');

exports.generateCode = (n) => {
  // Workaround method for Math.pow() and ** operator
  const pow = (base, exp) => {
    let result = 1;
    for (let i = 0; i < exp; i += 1) {
      result *= base;
    }
    return result;
  };
  const add = 1;
  let max = 12 - add;
  let min = 0;
  if (n > max) {
    return this.generateCode(max) + this.generateCode(n - max);
  }
  max = pow(10, n + add);
  min = max / 10;
  const number = Math.floor(Math.random() * (max - (min + 1))) + min;
  return ('' + number).substring(add);
};

// Checks if person is an admin user, use GuildMember object
exports.isAdmin = (member) => {
  const adminRoles = [
    'Admin', 'Armada Officers', 'Armada Officer', 'Fleet Officer',
    'Moderator', 'Tester',
  ];
  if (adminRoles.some(role => member.roles.find('name', role))) {
    return true;
  }
  return false;
};

// Checks if the member has been verified
exports.isVerified = async (userId) => {
  const memberData = await Member.findOne({ attributes: ['verified'], where: { discordUser: userId } });
  if (memberData) {
    return !!memberData.dataValues.verified;
  }
  return false;
};

// Update the user points in the database
exports.getUserPointsandUpdate = async (userId, pointsToAdd) => {
  const memberData = await Member.findOne({ attributes: ['points', 'verified'], where: { discordUser: userId } });
  const { points, verified } = memberData.dataValues;
  const pointsBeingAdded = parseFloat((points + pointsToAdd).toFixed(2));
  // Checks to see if the person has verified before adding points.
  verified ? await Member.update(
    { points: pointsBeingAdded },
    { where: { discordUser: userId } }) : util.log('User is not verified', userId, 4);
};

// Using async and await is the only way I could get this to work
// It needed to be forced to wait and go line by line to get the proper data
exports.welcomeCommand = async (member) => {
  const { user } = member;
  util.log('User id', user.id, 4);
  let welcomeString = null;
  const pointsMethods = `
    **How to Earn Points:**
    \n\`Chatting with friends\`
    Chat with others and earn points! Get rewarded for talking to others!
    \n\`Gaming, Streaming, and More!\`
    Be rewarded for engagement through streaming, playing games with others, listening to Spotify, and more!
    \n\`Invite New Members\`
    Invite other students from Full Sail University to the server and be awarded points!
  `;
  // Asnyc await was needed to set the string properly for being verified or not
  await this.isVerified(user.id).then((verified) => {
    if (verified) {
      welcomeString = `Welcome to the server ${user}! Start earning points! \n${pointsMethods}`;
    } else {
      welcomeString = `Welcome to the server ${user}! Get verified to start earning points! \n${pointsMethods}`;
    }
  });
  await member.send(welcomeString);
};

// E-mail template
exports.formatEmail = (emailBodyString) => {
  const emailTemplate = `<html>
                          <body>
                            <center data-parsed="">
                              <table align="center" class="container body-border float-center"><tbody><tr><td>
                                <table class="row"><tbody><tr>
                                  <th class="small-12 large-12 columns first last"><table><tr><th>
                                    <center data-parsed="">
                                      <img style="max-width: 50%;" src="https://i.imgur.com/ZEu7Qqe.png" align="center" class="float-center">
                                    </center>
                                    <table class="spacer"><tbody><tr><td height="16px" style="font-size:16px;line-height:16px;">&#xA0;</td></tr></tbody></table>
                                    <table style="margin: auto;">
                                      <tr><td><p>${emailBodyString}</p></td></tr>
                                    </table>
                                    <center data-parsed="">
                                      <table align="center" class="menu float-center"><tr><td><table><tr>
                                        <th class="menu-item float-center"><a href=" https://www.facebook.com/FullSailArmada/">Facebook</a></th>
                                        <th class="menu-item float-center"><a href="https://twitter.com/fullsailarmada">Twitter</a></th>
                                        <th class="menu-item float-center"><a href="https://www.twitch.tv/fullsailarmada">Twitch</a></th>
                                      </tr></table></td></tr></table>
                                    </center>
                                  </th>
                                  <th class="expander"></th></tr></table></th>
                                </tr></tbody></table>
                              </td></tr></tbody></table>
                            </center>
                          </body>
                        </html>`;
  return emailTemplate;
};


// Nodemailer email function
// Set up Nodemailer to send emails through gmail
exports.sendEmail = async (message, toEmailAdd, emailSubject,
  emailBody, emailSendType, callback) => {
  const sendInvite = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASS,
    },
  });
  // Nodemailer email recipient & message
  // the email template
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: toEmailAdd,
    subject: emailSubject,
    html: emailBody,
  };
  // Call sendMail on sendInvite
  // Pass mailOptions & callback function
  sendInvite.sendMail(mailOptions, (err, info) => {
    let messageTypeString = 'send an invite.';
    emailSendType === 'verify' ? messageTypeString = 'verify' : '';
    const errorMsg = `Oops, looks like the email can not be sent. It's not you, it's me. Please reach out to a moderator to help you ${messageTypeString}.`;
    if (err) {
      message.reply(errorMsg);
      util.log('Email not sent', err, 3);
      callback(false);
    } else {
      util.log('Email details', info, 3);
      callback(true);
    }
  });
  return null;
};
exports.validDomains = ['student.fullsail.edu', 'fullsail.edu', 'fullsail.com'];
