const { Sequelize } = require('sequelize');
const path = require('path');

// If a DATABASE_URL env var is provided (e.g., Postgres on Render), use it.
// Otherwise fall back to a worker-specific SQLite file (for tests) or default sqlite.
let sequelize;
if (process.env.DATABASE_URL) {
  // Use the full connection URL; Sequelize will infer dialect from the URL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    logging: false,
    dialectOptions: process.env.DB_SSL === 'true' ? { ssl: { require: true, rejectUnauthorized: false } } : {}
  });
} else {
  // Use a worker-specific DB file when running Jest in parallel (JEST_WORKER_ID set)
  const storagePath = process.env.JEST_WORKER_ID
    ? path.join(__dirname, `../../database-${process.env.JEST_WORKER_ID}.sqlite`)
    : path.join(__dirname, '../../database.sqlite');

  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false
  });
}

module.exports = sequelize;
