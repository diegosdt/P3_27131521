const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');



const category = sequelize.define('category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: DataTypes.STRING
});

module.exports = category;
