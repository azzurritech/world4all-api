const { hashPassword } = require('../../common/hash-password');
const { dateToUTC } = require('../../common/date-to-utc');

const mapUserDbRowToUserType = (user) => ({
	id: user.id,
	firstName: user.first_name,
	lastName: user.last_name,
	email: user.email,
	dateBirth: dateToUTC(user.date_birth),
	phone: user.phone,
	accompanied: user.accompanied,
	role: user.role,
	avatar: user.pictureId
		? {
			id: user.pictureId,
			url: user.url,
		}
		: null,
	createdAt: user.created_at,
	updatedAt: user.updated_at,
	isActive: user.is_active,
	enabled: user.enabled,
});

// Make it better if need =)
const mapUserTypeToUserDbRow = (userMutationFields) => {
	const userDbRow = {};

	if (userMutationFields) {
		if (userMutationFields.firstName) {
			userDbRow.first_name = userMutationFields.firstName;
		}

		if (userMutationFields.lastName) {
			userDbRow.last_name = userMutationFields.lastName;
		}

		if (userMutationFields.email) {
			userDbRow.email = userMutationFields.email;
		}

		if (userMutationFields.password) {
			userDbRow.password = hashPassword(userMutationFields.password);
		}

		if (userMutationFields.dateBirth) {
			userDbRow.date_birth = userMutationFields.dateBirth;
		}

		if (userMutationFields.phone) {
			userDbRow.phone = userMutationFields.phone;
		}

		if (userMutationFields.avatarId) {
			userDbRow.avatar_id = userMutationFields.avatarId;
		}

		if (userMutationFields.isActive
			|| (typeof userMutationFields.isActive === 'boolean' && userMutationFields.isActive === false)
		) {
			userDbRow.is_active = userMutationFields.isActive;
		}

		if (userMutationFields.enabled
			|| (typeof userMutationFields.enabled === 'boolean' && userMutationFields.enabled === false)
		) {
			userDbRow.enabled = userMutationFields.enabled;
		}

		if (userMutationFields.accompanied
			|| (typeof userMutationFields.accompanied === 'boolean' && userMutationFields.accompanied === false)
		) {
			userDbRow.accompanied = userMutationFields.accompanied;
		}

		if (userMutationFields.role) {
			userDbRow.role = userMutationFields.role;
		}
	}

	return userDbRow;
};

module.exports = {
	mapUserDbRowToUserType,
	mapUserTypeToUserDbRow,
};
