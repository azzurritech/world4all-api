const sgMail = require('@sendgrid/mail');

const sendGridClient = sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = { sendGridClient };
