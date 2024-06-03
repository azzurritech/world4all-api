const { Router } = require('express');

const knex = require('../../mysql/knex');
const userQueries = require('../users/user.queries');
const usersConfirmationRegistrationCodes = require('../users/users-confirmation-registration-codes.queries');
const { createLogger } = require('../../logger/logger');

const logger = createLogger({
  moduleName: 'confirmation_registration',
});

const router = Router();

router.get('/auth/confirm-registration', async (request, response) => {
  if (!request.query && request.query.code) {
    logger.error({
      message: 'Confirmation registration code not found',
    });

    // WARN: We can to redirect to login or root site page (landing)
    response.status(404);
    return;
  }

  const user = await usersConfirmationRegistrationCodes.findUserByCode(knex, request.query.code);

  if (!user || !user.id) {
    logger.error({
      message: 'User not found',
    });

    // WARN: We can to redirect to login or root site page (landing)
    response.status(404);
    return;
  }

  await Promise.all([
    userQueries.update(knex, user.id, { isActive: true }),
    usersConfirmationRegistrationCodes.drop(knex, user.id, request.query.code),
  ]);

  // WARN: This redirect path is just for example. Fix it if you need
  response.redirect(`${process.env.FRONTEND_URL}/after-registration`);
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;


  const result = await execute({
    schema,
    document: resetPasswordQuery, 
    contextValue: { email, newPassword } 
  });

  
  res.send(result);
});

module.exports = router;
