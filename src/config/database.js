const { Sequelize } = require('sequelize');
const path = require('path');

// Use a worker-specific DB file when running Jest in parallel to avoid
// tests interfering with each other (Jest sets JEST_WORKER_ID).
const storagePath = process.env.JEST_WORKER_ID
  ? path.join(__dirname, `../../database-${process.env.JEST_WORKER_ID}.sqlite`)
  : path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false
});

module.exports = sequelize;
