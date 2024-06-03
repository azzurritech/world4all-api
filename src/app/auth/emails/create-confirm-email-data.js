function createConfirmEmailData(userCode) {
  return {
    html: `
    <html>
      <body>
      <p><a href="${process.env.BACKEND_URL}/auth/confirm-registration?code=${userCode}">World4all site</a></p>
      </body>
    </html>`,
    subject: 'Confirmation of registration',
  };
}

module.exports = { createConfirmEmailData };
