const mapFacilityTypeToFacilityDbRow = (facilityMutationFields) => {
  const facilityDbRow = {};

  if (facilityMutationFields) {
    if (facilityMutationFields.name) {
      facilityDbRow.name = facilityMutationFields.name;
    }

    if (facilityMutationFields.image_id) {
      facilityDbRow.image_id = facilityMutationFields.image_id;
    }
    // eslint-disable-next-line dot-notation
    if (typeof facilityMutationFields['isDisabled'] !== 'undefined') {
      facilityDbRow.is_disabled = facilityMutationFields.isDisabled;
    }
  }

  return facilityDbRow;
};

module.exports = { mapFacilityTypeToFacilityDbRow };
