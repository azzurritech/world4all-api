const mapUserAddressDbRowToUserType = (userAddress) => ({
  id: userAddress.id,
  country: userAddress.country,
  city: userAddress.city,
  street: userAddress.street,
  buildingNumber: userAddress.building_number,
  apartment: userAddress.apartment,
});

// Make it better if need =)
const mapUserAddressTypeToUserAddressDbRow = (userAddressMutationFields) => {
  const userAddressDbRow = {};

  if (userAddressMutationFields) {
    if (userAddressMutationFields.country) {
      userAddressDbRow.country = userAddressMutationFields.country;
    }

    if (userAddressMutationFields.city) {
      userAddressDbRow.city = userAddressMutationFields.city;
    }

    if (userAddressMutationFields.street) {
      userAddressDbRow.street = userAddressMutationFields.street;
    }

    if (userAddressMutationFields.buildingNumber) {
      userAddressDbRow.building_number = userAddressMutationFields.buildingNumber;
    }

    if (userAddressMutationFields.apartment || userAddressMutationFields.apartment === '') {
      if (userAddressMutationFields.apartment === '') {
        userAddressDbRow.apartment = null;
      }

      userAddressDbRow.apartment = userAddressMutationFields.apartment;
    }
  }

  return userAddressDbRow;
};

module.exports = {
  mapUserAddressDbRowToUserType,
  mapUserAddressTypeToUserAddressDbRow,
};
