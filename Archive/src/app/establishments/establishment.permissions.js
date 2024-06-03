const {
	isAdmin,
	isAny,
} = require('../../permissions/predicates');

module.exports = {
	Mutation: {
		createEstablishment: isAdmin,
		editEstablishment: isAdmin,
		deleteEstablishment: isAdmin,
		disableEstablishment: isAdmin,
		addCoverPicture: isAdmin,
		addPicturesToEstablishmentGallery: isAdmin,
		dropPictureFromEstablishmentGallery: isAdmin,
		editEstablishmentGalleryPicture: isAdmin,
	},
	Query: {
		establishment: isAny,
		establishmentsList: isAny,
	},
};
