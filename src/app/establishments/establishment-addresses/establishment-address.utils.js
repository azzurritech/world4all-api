// Make it better if need =)
const mapEstablishmentAddressTypeToEstablishmentAddressDbRow = (
  establishmentAddressMutationFields,
) => {
  const establishmentAddressDbRow = {};

  if (establishmentAddressMutationFields) {
    if (establishmentAddressMutationFields.country) {
      establishmentAddressDbRow.country = establishmentAddressMutationFields.country;
    }

    if (establishmentAddressMutationFields.city) {
      establishmentAddressDbRow.city = establishmentAddressMutationFields.city;
    }

    if (establishmentAddressMutationFields.street) {
      establishmentAddressDbRow.street = establishmentAddressMutationFields.street;
    }

    if (establishmentAddressMutationFields.lat) {
      establishmentAddressDbRow.lat = establishmentAddressMutationFields.lat;
    }

    if (establishmentAddressMutationFields.lng) {
      establishmentAddressDbRow.lng = establishmentAddressMutationFields.lng;
    }

    if (establishmentAddressMutationFields.buildingNumber) {
      establishmentAddressDbRow.building_number = establishmentAddressMutationFields.buildingNumber;
    }

    if (establishmentAddressMutationFields.apartment || establishmentAddressMutationFields.apartment === '') {
      if (establishmentAddressMutationFields.apartment === '') {
        establishmentAddressDbRow.apartment = null;
      }

      establishmentAddressDbRow.apartment = establishmentAddressMutationFields.apartment;
    }
  }

  return establishmentAddressDbRow;
};

module.exports = {
  mapEstablishmentAddressTypeToEstablishmentAddressDbRow,
};
