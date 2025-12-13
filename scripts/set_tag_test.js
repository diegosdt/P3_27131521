const sequelize = require('../src/config/database');
const { Book, Tag } = require('../src/models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la DB');

    const book = await Book.findOne();
    const tag = await Tag.findOne();
    if (!book) return console.error('No hay books');
    if (!tag) return console.error('No hay tags');

    console.log('Antes, BookTags rows:');
    const [before] = await sequelize.query('SELECT * FROM BookTags');
    console.log(JSON.stringify(before, null, 2));

    console.log(`Asociando tag id=${tag.id} al book id=${book.id}`);
    await book.setTags([tag]);

    const [after] = await sequelize.query('SELECT * FROM BookTags');
    console.log('Después, BookTags rows:');
    console.log(JSON.stringify(after, null, 2));

    const refreshed = await Book.findByPk(book.id, { include: [{ model: Tag, as: 'tags', through: { attributes: [] } }] });
    console.log('Book con tags después:');
    console.log(JSON.stringify({ id: refreshed.id, title: refreshed.title, tags: refreshed.tags }, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error en set_tag_test:', err);
    process.exit(1);
  }
})();
