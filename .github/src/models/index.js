const Book = require('./book');
const Category = require('./category');
const Tag = require('./tag');
const User = require('./user');
const Order = require('./order');
const OrderItem = require('./orderItem');

// Book - Category
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books' });

// Book - Tag (many-to-many)
Book.belongsToMany(Tag, { through: 'BookTags', as: 'tags' });
Tag.belongsToMany(Book, { through: 'BookTags', as: 'books' });

// Order relations
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });

// Order - Book through OrderItem
Order.belongsToMany(Book, { through: OrderItem, as: 'products' });
Book.belongsToMany(Order, { through: OrderItem, as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'OrderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'OrderId' });

OrderItem.belongsTo(Book, { foreignKey: 'BookId', as: 'product' });
Book.hasMany(OrderItem, { foreignKey: 'BookId' });

module.exports = { Book, Category, Tag, User, Order, OrderItem };



