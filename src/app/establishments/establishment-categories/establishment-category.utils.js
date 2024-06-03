const mapCategoryTypeToCategoryDbRow = (categoryMutationFields) => {
  const categoryDbRow = {};

  if (categoryMutationFields) {
    if (categoryMutationFields.name) {
      categoryDbRow.name = categoryMutationFields.name;
    }

    if (categoryMutationFields.image_id) {
      categoryDbRow.image_id = categoryMutationFields.image_id;
    }

    // eslint-disable-next-line dot-notation
    if (typeof categoryMutationFields['isDisabled'] !== 'undefined') {
      categoryDbRow.is_disabled = categoryMutationFields.isDisabled;
    }
  }

  return categoryDbRow;
};

module.exports = { mapCategoryTypeToCategoryDbRow };
