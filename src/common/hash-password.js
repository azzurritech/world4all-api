const { createHash } = require('crypto');

function hashPassword(password) {
  const hash = createHash('sha256').update(password, 'utf8').digest('hex');

  return hash;
}

module.exports = { hashPassword };
