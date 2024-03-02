const nodemailer = require('nodemailer');

const sendEmail = async options => {
  // create a  transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  //defind the email option
  const mailOptions = {
    from: 'Jay Zadafiya',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
