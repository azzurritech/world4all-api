function createResetPasswordData(userCode,userName) {
  return {
   /* html: `
    <html>
      <body>
      <p><a href="${process.env.FRONTEND_URL}/auth/reset-password?code=${userCode}">World4all site</a></p>
      </body>
    </html>`,*/
    templateId : "d-c9bfe0719f3d44e6b7de181fe7cb68e9",
    dynamic_template_data :  { //data dicamica in template
                          url: process.env.FRONTEND_URL_EMAIL + "/?code="+ userCode, //metadati
                          nome: userName
                      },
    subject: 'Reset password - Worl4All',
  };
}

module.exports = { createResetPasswordData };
