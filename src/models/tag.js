const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', {
  name: { type: DataTypes.STRING, unique: true, allowNull: false }
});

module.exports = Tag;
