const Book = require('./book');
const category = require('./category');
const Tag = require('./tag');

Book.belongsTo(category);
category.hasMany(Book);

Book.belongsToMany(Tag, { through: 'BookTags' });
Tag.belongsToMany(Book, { through: 'BookTags' });

module.exports = { Book, category, Tag };
