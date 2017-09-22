const nodemailer = require('nodemailer');

module.exports = (data) => {
  nodemailer.createTestAccount((err, account) => {
     // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'fsmaxbot@gmail.com',
        pass: 'fullsail2017',
      },
    });
     // setup email data with unicode symbols
    let mailOptions = {
      from: 'fsmaxbot@gmail.com', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.html, // html body
    };
     // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      error ? console.error(error) : console.log('Message Sent.');
    });
  });
};
