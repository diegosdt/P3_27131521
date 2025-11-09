const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  description: DataTypes.TEXT
});

module.exports = Category;
