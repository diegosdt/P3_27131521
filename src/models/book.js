const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const slugify = require('slugify');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  price: DataTypes.FLOAT,
  stock: DataTypes.INTEGER,
  author: DataTypes.STRING,
  publisher: DataTypes.STRING,
  publicationYear: DataTypes.INTEGER,
  language: DataTypes.STRING,
  format: DataTypes.STRING,
  slug: { type: DataTypes.STRING, unique: true }
});

Book.beforeCreate(book => {
  book.slug = slugify(book.title, { lower: true });
});
Book.beforeUpdate(book => {
  book.slug = slugify(book.title, { lower: true });
});

module.exports = Book;
