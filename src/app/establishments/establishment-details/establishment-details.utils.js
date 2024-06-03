// eslint-disable-next-line max-len
const mapEstablishmentDetailsDbRowToEstablishmentDetailsType = (establishmentDetails) => establishmentDetails
  .map((establishmentDetail) => ({
    id: establishmentDetail.id,
    code: establishmentDetail.code,
    description: establishmentDetail.description,
    title: establishmentDetail.title,
    image: establishmentDetail.pictureId
      ? {
        id: establishmentDetail.pictureId,
        url: establishmentDetail.url,
      }
      : null,
  }));

const mapEstablishmentDetailsTypeToEstablishmentDetailsDbRow = (
  establishmentDetailsMutationFields,
) => {
  const establishmentDetailsDbRow = {};

  if (establishmentDetailsMutationFields) {
    if (establishmentDetailsMutationFields.id) {
      establishmentDetailsDbRow.id = establishmentDetailsMutationFields.id;
    }

    if (establishmentDetailsMutationFields.code) {
      establishmentDetailsDbRow.code = establishmentDetailsMutationFields.code;
    }

    if (establishmentDetailsMutationFields.description) {
      establishmentDetailsDbRow.description = establishmentDetailsMutationFields.description;
    }

    if (establishmentDetailsMutationFields.title) {
      establishmentDetailsDbRow.title = establishmentDetailsMutationFields.title;
    }

    if (establishmentDetailsMutationFields.imageId) {
      establishmentDetailsDbRow.image_id = establishmentDetailsMutationFields.imageId;
    }
  }

  return establishmentDetailsDbRow;
};

module.exports = {
  mapEstablishmentDetailsTypeToEstablishmentDetailsDbRow,
  mapEstablishmentDetailsDbRowToEstablishmentDetailsType,
};
