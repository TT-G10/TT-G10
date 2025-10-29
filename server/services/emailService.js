const nodemailer = require('nodemailer');

const getTransport = () => {
  const { EMAIL_USER, EMAIL_PASS } = process.env;
  if (!EMAIL_USER || !EMAIL_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
};

const sendMatchSummaryEmail = async ({ recipients, subject, text }) => {
  const transport = getTransport();
  if (!transport) {
    console.log('Email disabled. Summary:', { recipients, subject, text });
    return;
  }

  await transport.sendMail({
    from: process.env.EMAIL_USER,
    to: recipients,
    subject,
    text
  });
};

module.exports = {
  sendMatchSummaryEmail
};
