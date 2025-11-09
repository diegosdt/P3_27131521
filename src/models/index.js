const Book = require('./book');
const Category = require('./Category');
const Tag = require('./Tag');

Book.belongsTo(Category);
Category.hasMany(Book);

Book.belongsToMany(Tag, { through: 'BookTags' });
Tag.belongsToMany(Book, { through: 'BookTags' });

module.exports = { Book, Category, Tag };
