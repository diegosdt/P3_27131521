const sequelize = require('../src/config/database');
const { Book, Tag } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la DB');

    const books = await Book.findAll({ include: [{ model: Tag, as: 'tags', through: { attributes: [] } }] });
    console.log('Books with tags:');
    console.log(JSON.stringify(books.map(b => ({ id: b.id, title: b.title, tags: b.tags })), null, 2));

    const tags = await Tag.findAll();
    console.log('All tags:');
    console.log(JSON.stringify(tags, null, 2));

    // Raw query to see join table
    const [results] = await sequelize.query('SELECT * FROM BookTags');
    console.log('BookTags rows:');
    console.log(JSON.stringify(results, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error en debug_tags:', err);
    process.exit(1);
  }
})();
