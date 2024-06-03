const { ApolloError } = require('apollo-server-errors');

const { BAD_REQUEST } = require('./errors');

class JoiValidationError extends ApolloError {
  constructor(joiError) {
    super('invalid input', BAD_REQUEST.code, {
      details: joiError.details,
    });
  }
}

const schemaValidation = (schema, inputArgs) => {
  const { error, value } = schema.validate(inputArgs);

  if (error) {
    throw new JoiValidationError(error);
  }

  return value;
};

module.exports = { schemaValidation, JoiValidationError };
