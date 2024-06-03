const mapDisabilityTypeToDisabilityDbRow = (disabilityMutationFields) => {
  const disabilityDbRow = {};

  if (disabilityMutationFields) {
    if (disabilityMutationFields.name) {
      disabilityDbRow.name = disabilityMutationFields.name;
    }

    if (disabilityMutationFields.image_id) {
      disabilityDbRow.image_id = disabilityMutationFields.image_id;
    }

    // eslint-disable-next-line dot-notation
    if (typeof disabilityMutationFields['isDisabled'] !== 'undefined') {
      disabilityDbRow.is_disabled = disabilityMutationFields.isDisabled;
    }
  }

  return disabilityDbRow;
};

module.exports = { mapDisabilityTypeToDisabilityDbRow };
