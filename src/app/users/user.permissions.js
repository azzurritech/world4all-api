const {
	isAuthenticated,
	isAdmin,
} = require('../../permissions/predicates');

module.exports = {
	Mutation: {
		editUser: isAuthenticated,
		editUserByAdmin: isAdmin,
		deactivateUser: isAdmin,
		disableUser: isAdmin,
		
	},
	Query: {
		me: isAuthenticated,
		getUser: isAdmin,
		activeUsersList: isAdmin,
		allUsers: isAuthenticated,
	},
};
