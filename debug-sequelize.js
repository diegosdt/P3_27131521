const sequelize = require('./src/config/database');
const models = require('./src/models');

(async () => {
  try {
    await sequelize.sync();
    console.log('Sync done, checking tables...');
    const qi = sequelize.getQueryInterface();
    const tables = await qi.showAllTables();
    console.log('Tables:', tables);

    if (models.User) {
      const users = await models.User.findAll();
      console.log('User count:', users.length);
    }

    await sequelize.close();
  } catch (err) {
    console.error('Error debugging sequelize:', err);
  }
})();