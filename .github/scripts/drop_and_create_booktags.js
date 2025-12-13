const sequelize = require('../src/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la DB');

    await sequelize.query('DROP TABLE IF EXISTS BookTags');
    console.log('BookTags dropped');

    await sequelize.query(`CREATE TABLE BookTags (
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      BookId INTEGER NOT NULL,
      TagId INTEGER NOT NULL,
      PRIMARY KEY (BookId, TagId)
    )`);
    console.log('BookTags created without UNIQUE on columns');

    const [tableSql] = await sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='BookTags'");
    console.log('New table sql:', JSON.stringify(tableSql, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
