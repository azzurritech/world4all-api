const mapTypologyTypeToTypologyDbRow = (typologyMutationFields) => {
  const typologyDbRow = {};

  if (typologyMutationFields) {
    if (typologyMutationFields.name) {
      typologyDbRow.name = typologyMutationFields.name;
    }

    // eslint-disable-next-line dot-notation
    if (typeof typologyMutationFields['isDisabled'] !== 'undefined') {
      typologyDbRow.is_disabled = typologyMutationFields.isDisabled;
    }
  }

  return typologyDbRow;
};

module.exports = { mapTypologyTypeToTypologyDbRow };
