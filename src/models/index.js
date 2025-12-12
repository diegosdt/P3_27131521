const Book = require('./book');
const Category = require('./category'); 
const Tag = require('./tag');

Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });

Book.belongsToMany(Tag, { through: 'BookTags', as: 'tags' });
Tag.belongsToMany(Book, { through: 'BookTags', as: 'books' });

module.exports = { Book, Category, Tag };



