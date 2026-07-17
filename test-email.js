const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD?.replace(/\s+/g, ''),
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("Error details:", error);
  } else {
    console.log("Server is ready to take our messages");
  }
});
