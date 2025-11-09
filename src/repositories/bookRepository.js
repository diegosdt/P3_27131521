const { Book, Category, Tag } = require('../models');
const buildBookQuery = require('../services/bookQueryBuilder');

async function findBooks(query, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const { where, include } = buildBookQuery(query);

  const result = await Book.findAndCountAll({
    where,
    include,
    limit,
    offset
  });

  return {
    total: result.count,
    page,
    pages: Math.ceil(result.count / limit),
    books: result.rows
  };
}

module.exports = { findBooks };
