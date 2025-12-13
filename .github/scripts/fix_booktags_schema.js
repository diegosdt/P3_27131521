const sequelize = require('../src/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la DB');

    // Rename old table, create correct new table, copy data, drop old
    const sql = `
      BEGIN TRANSACTION;
      ALTER TABLE BookTags RENAME TO BookTags_old;
      CREATE TABLE BookTags (
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        BookId INTEGER NOT NULL,
        TagId INTEGER NOT NULL,
        PRIMARY KEY (BookId, TagId)
      );
      INSERT INTO BookTags (createdAt, updatedAt, BookId, TagId)
        SELECT createdAt, updatedAt, BookId, TagId FROM BookTags_old;
      DROP TABLE BookTags_old;
      COMMIT;
    `;

    await sequelize.query(sql);
    console.log('BookTags schema recreado correctamente');
    process.exit(0);
  } catch (err) {
    console.error('Error al recrear BookTags:', err);
    process.exit(1);
  }
})();
