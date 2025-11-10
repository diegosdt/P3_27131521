const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tag = sequelize.define('Tag', { name: DataTypes.STRING });
module.exports = Tag;


module.exports = Tag;
