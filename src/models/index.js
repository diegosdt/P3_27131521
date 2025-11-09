const Book = require('./book');
const Category = require('./category');
const Tag = require('./tag');

Book.belongsTo(Category);
Category.hasMany(Book);

Book.belongsToMany(Tag, { through: 'BookTags' });
Tag.belongsToMany(Book, { through: 'BookTags' });

module.exports = { Book, Category, Tag };
