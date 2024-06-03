const mapEstablishmentDbRowToEstablishmentType = (establishment) => ({
	id: establishment.id,
	name: establishment.name,
	email: establishment.email,
	phone: establishment.phone,
	website: establishment.website,
	description: establishment.description,
	distance: establishment.distance,
	cover: establishment.cover_id
		? {
			id: establishment.cover_id,
			url: establishment.url,
		}
		: null,
	createdAt: establishment.created_at,
	updatedAt: establishment.updated_at,
	enabled: establishment.enabled,
});

// Make it better if need =)
const mapEstablishmentTypeToEstablishmentDbRow = (establishmentMutationFields) => {
	const establishmentDbRow = {};

	if (establishmentMutationFields) {
		if (establishmentMutationFields.name) {
			establishmentDbRow.name = establishmentMutationFields.name;
		}

		if (establishmentMutationFields.email) {
			establishmentDbRow.email = establishmentMutationFields.email;
		}

		if (establishmentMutationFields.phone) {
			establishmentDbRow.phone = establishmentMutationFields.phone;
		}

		if (establishmentMutationFields.website) {
			establishmentDbRow.website = establishmentMutationFields.website;
		}

		if (establishmentMutationFields.description) {
			establishmentDbRow.description = establishmentMutationFields.description;
		}

		if (establishmentMutationFields.distance) {
			establishmentDbRow.distance = establishmentMutationFields.distance;
		}

		if (establishmentMutationFields.coverId) {
			establishmentDbRow.cover_id = establishmentMutationFields.coverId;
		}

		if (establishmentMutationFields.enabled
			|| (typeof establishmentMutationFields.enabled === 'boolean' && establishmentMutationFields.enabled === false)
		) {
			establishmentMutationFields.enabled = establishmentMutationFields.enabled;
		}
	}

	return establishmentDbRow;
};

module.exports = {
	mapEstablishmentDbRowToEstablishmentType,
	mapEstablishmentTypeToEstablishmentDbRow,
};
