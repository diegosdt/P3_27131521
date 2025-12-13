const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'PENDING' },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 }
});

module.exports = Order;
