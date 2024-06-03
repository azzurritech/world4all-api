const jwt = require('jsonwebtoken');

function createToken(userId) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  return token;
}

function decodeToken(token) {
  const data = jwt.verify(token, process.env.JWT_SECRET);

  return data;
}

module.exports = {
  createToken,
  decodeToken,
};
