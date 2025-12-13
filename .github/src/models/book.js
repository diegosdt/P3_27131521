const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  author: { type: DataTypes.STRING, allowNull: false },
  publisher: { type: DataTypes.STRING, allowNull: false },
  publicationYear: { type: DataTypes.INTEGER },
  language: { type: DataTypes.STRING },
  format: { type: DataTypes.STRING }
});

module.exports = Book;

