const { shield } = require('graphql-shield');

const checkPermissions = (permissions) => shield(permissions,
  {
    allowExternalErrors: true,
  });

module.exports = { checkPermissions };
