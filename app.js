const dotenv = require('dotenv');

dotenv.config();

const { createLogger } = require('./src/logger/logger');
const knex = require('./src/mysql/knex');

const logger = createLogger({
  moduleName: 'bootstrap',
});

const { startApolloServer } = require('./src/server/graphql-server');

(async () => {
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const appliedResult = await knex.migrate.up();

      logger.info({
        message: 'Applied migration',
        migrations: appliedResult[1],
      });

      if (appliedResult[1].length === 0) {
        break;
      }
    }

    await startApolloServer();
  } catch (error) {
    logger.error({
      message: 'Error when server starting',
      error,
    });

    process.exit(1);
  }
})();
