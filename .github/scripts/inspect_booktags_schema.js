const sequelize = require('../src/config/database');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la DB');
    const [cols] = await sequelize.query("PRAGMA table_info('BookTags')");
    console.log('PRAGMA table_info BookTags:');
    console.log(JSON.stringify(cols, null, 2));

    const [indexes] = await sequelize.query("PRAGMA index_list('BookTags')");
    console.log('PRAGMA index_list BookTags:');
    console.log(JSON.stringify(indexes, null, 2));

    for (const idx of indexes) {
      const [info] = await sequelize.query(`PRAGMA index_info('${idx.name}')`);
      console.log(`Index info ${idx.name}:`, JSON.stringify(info, null, 2));
    }

    const [tableSql] = await sequelize.query("SELECT sql FROM sqlite_master WHERE type='table' AND name='BookTags'");
    console.log('sqlite_master sql for BookTags:', JSON.stringify(tableSql, null, 2));

    const [all] = await sequelize.query("SELECT name, sql FROM sqlite_master WHERE name LIKE 'BookTags%'");
    console.log('All sqlite_master entries like BookTags%:', JSON.stringify(all, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error inspect:', err);
    process.exit(1);
  }
})();
