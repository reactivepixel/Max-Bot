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

// Update the user points in the database
exports.getUserPointsandUpdate = async (userId, pointsToAdd) => {
  const memberData = await Member.findAll({ attributes: ['points'], where: { discordUser: userId } });
  await Member.update(
    { points: memberData[0].dataValues.points + pointsToAdd },
    { where: { discordUser: userId } });
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
