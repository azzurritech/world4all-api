const datesResolver = require('graphql-iso-date');
const { ApolloError } = require('apollo-server-errors');
const randomstring = require('randomstring');

const userQueries = require('../users/user.queries');
const userAddressesQueries = require('../users/user-addresses/user-address.queries');
const disabilitiesToUsersQueries = require('../disabilities/disabilities-to-users.queries');
const facilitiesToUsersQueries = require('../facilities/facilities-to-users.queries');
const usersConfirmationRegistrationCodesQueries = require('../users/users-confirmation-registration-codes.queries');
const usersChangePasswordCodesQueries = require('../users/users-change-password-codes.queries');

const { UserRoles } = require('../users/user.constants');
const { createToken } = require('./auth.utils');
const { hashPassword } = require('../../common/hash-password');
const { NOT_FOUND } = require('../../common/errors');
const { schemaValidation } = require('../../common/schema-validation');
const {
  signInSchema,
  signUpUserSchema,
  requestResetPasswordSchema,
  changePasswordSchema,
} = require('./auth.validators');
const { createConfirmEmailData } = require('./emails/create-confirm-email-data');
const { createResetPasswordData } = require('./emails/create-reset-password-data');
const { sendEmail } = require('../../sendgrid/send-email');

const resolvers = {
  ...datesResolver,

  Query: {},

  Mutation: {
    async signUp(parent, { signUpInput }, { knex }) {
      const validatedArgs = schemaValidation(signUpUserSchema, signUpInput);

      if (!process.env.NOTIFICATION_EMAIL) {
        throw new ApolloError(
          'World4all notification email not found',
          NOT_FOUND.code,
        );
      }

      const {
        address,
        disabilityIds,
        facilityIds,
        ...userFields
      } = validatedArgs;

      const createdUserId = await knex.transaction(async (trx) => {
        await userQueries.insert(trx, {
          ...userFields,
          role: UserRoles.STANDARD,
          password: hashPassword(userFields.password),
        });

        const { id } = await userQueries.findLastInserted(trx);

        await Promise.all([
          userAddressesQueries.insert(trx, {
            ...address,
            user_id: id,
          }),
          disabilitiesToUsersQueries.insert(trx, id, disabilityIds),
          facilitiesToUsersQueries.insert(trx, id, facilityIds),
        ]);

        return id;
      });

      const confirmationCode = randomstring.generate();

      await usersConfirmationRegistrationCodesQueries.insert(knex, createdUserId, confirmationCode);

      const {
        html,
        subject,
      } = createConfirmEmailData(confirmationCode);

      /*
      await sendEmail(
        {
          to: userFields.email,
          subject,
          html,
        },
      );
      */

      // Return jwtToken if you need
      return { success: true };
    },

    async signIn(parent, { signInInput }, { knex }) {
      const validatedArgs = schemaValidation(signInSchema, signInInput);

      const hashedPassword = hashPassword(validatedArgs.password);

      const user = await userQueries.findByEmailAndPassword(
        knex, validatedArgs.login, hashedPassword,
      );

      if (!user) {
        throw new ApolloError(
          'user not found',
          NOT_FOUND.code,
        );
      }

      const jwtToken = createToken(user.id);

      return {
        jwtToken,
      };
    },

    async requestResetPassword(parent, { requestResetPasswordInput }, { knex }) {
      const { email } = schemaValidation(requestResetPasswordSchema, requestResetPasswordInput);

      const user = await userQueries.findByEmail(knex, email);

      if (!user || !user.id) {
        throw new ApolloError(
          'user by email not found',
          NOT_FOUND.code,
        );
      }

      const confirmationCode = randomstring.generate();

      await usersChangePasswordCodesQueries.insert(knex, user.id, confirmationCode);

      const {
        subject,
        templateId,
        dynamic_template_data
      } = createResetPasswordData(confirmationCode, user.first_name);




       await sendEmail(
            {
              to: email,
              subject,
              templateId,
              dynamic_template_data,
            },
          );


      return { success: true };
    },

    async changePassword(parent, { changePasswordInput }, { knex }) {
      const {
        code,
        password,
      } = schemaValidation(changePasswordSchema, changePasswordInput);

      const user = await usersChangePasswordCodesQueries.findUserByCode(knex, code);

      await usersChangePasswordCodesQueries.drop(knex, user.id, code);

      await userQueries.update(knex, user.id, { password });

      return { success: true };
    },
  },

  // It's example of resolver for custom input type - not Query or Mutation

  // SignUpInput: {
  //   email(...args) {
  //     console.log('ARGGGS', args);
  //     return 'aaaaaa';
  //   },
  // },
};

module.exports = { resolvers };
