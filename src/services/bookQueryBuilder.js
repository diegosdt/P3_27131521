const { Op } = require('sequelize');

function buildBookQuery(query) {
  const where = {};
  const include = [];

  if (query.search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${query.search}%` } },
      { description: { [Op.like]: `%${query.search}%` } }
    ];
  }

  if (query.price_min || query.price_max) {
    where.price = {};
    if (query.price_min) where.price[Op.gte] = parseFloat(query.price_min);
    if (query.price_max) where.price[Op.lte] = parseFloat(query.price_max);
  }

  if (query.author) where.author = query.author;
  if (query.publisher) where.publisher = query.publisher;
  if (query.publicationYear) where.publicationYear = query.publicationYear;
  if (query.language) where.language = query.language;
  if (query.format) where.format = query.format;

  if (query.category) {
    include.push({
      association: 'Category',
      where: { name: query.category }
    });
  }

  if (query.tags) {
    const tagIds = query.tags.split(',').map(id => parseInt(id));
    include.push({
      association: 'Tags',
      where: { id: tagIds }
    });
  }

  return { where, include };
}

module.exports = buildBookQuery;
