const { isAny } = require('../../permissions/predicates');

module.exports = {
  Mutation: {
    signUp: isAny,
    signIn: isAny,
    requestResetPassword: isAny,
    changePassword: isAny,
    resetPassword: isAny,
  },
  Query: {},
};
