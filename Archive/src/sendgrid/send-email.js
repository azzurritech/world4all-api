const { sendGridClient } = require('./sendgrid');

const { createLogger } = require('../logger/logger');

const logger = createLogger({
  moduleName: 'sendgrid',
});

async function sendEmail(inputEmailData) {
  const {
    to,
    subject,
  } = inputEmailData;

  const msg = {
    to,
    from: process.env.NOTIFICATION_EMAIL,
    subject,
  };

  // WARN: You can send only one of this: text or html
  if (inputEmailData.text) {
    msg.text = inputEmailData.text;
  }

  if (inputEmailData.html) {
    msg.html = inputEmailData.html;
  }

  if (inputEmailData.templateId) {
      msg.templateId = inputEmailData.templateId;
   }

   if (inputEmailData.dynamic_template_data) {
         msg.dynamic_template_data = inputEmailData.dynamic_template_data;
      }

  try {
    //sendGridClient.setSubstitutionWrappers('{{', '}}');
    await sendGridClient.send(msg);
  } catch (error) {
    logger.error({
      message: 'Error when sending email',
      error,
    });
  }
}

module.exports = { sendEmail };
