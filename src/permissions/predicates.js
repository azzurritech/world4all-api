const { rule } = require('graphql-shield');
const { UserRoles } = require('../app/users/user.constants');

// Predicate for queries and mutations without authorization requirement
const isAny = rule({})(async () => true);

const isAuthenticated = rule({ cache: 'contextual' })(async (parent, args, ctx) => Boolean(ctx.user));

const isAdmin = rule({ cache: 'contextual' })(async (parent, args, ctx) => Boolean(ctx.user) && ctx.user.role === UserRoles.ADMIN);

const isStandardUser = rule({ cache: 'contextual' })(
  async (parent, args, ctx) => Boolean(ctx.user) && ctx.user.role === UserRoles.STANDARD,
);

module.exports = {
  isAny,
  isAdmin,
  isStandardUser,
  isAuthenticated,
};
