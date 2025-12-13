const { Op } = require('sequelize');
const { Category, Tag } = require('../models');

function buildBookQuery(params = {}) {
  const { page = 1, limit = 10, search, categoryId, tagIds, minPrice, maxPrice, publisher, language, format } = params;

  const p = Number(page) || 1;
  const l = Number(limit) || 10;

  const where = {};
  const include = [
    { model: Category, as: 'category' },
    { model: Tag, as: 'tags', through: { attributes: [] } }
  ];

  if (search) {
    where[Op.or] = [
      { title: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }

  if (categoryId) {
    where.categoryId = Number(categoryId);
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
  }

  if (publisher) where.publisher = { [Op.like]: `%${publisher}%` };
  if (language) where.language = { [Op.like]: `%${language}%` };
  if (format) where.format = { [Op.like]: `%${format}%` };

  // Filtrar por tags: si se solicitan tagIds, ajustamos el include del Tag con where
  if (tagIds && Array.isArray(tagIds) && tagIds.length) {
    const ids = tagIds.map(Number).filter(n => !Number.isNaN(n));
    if (ids.length) {
      // Reemplazamos el include de tags por uno con filtro
      include[1] = { model: Tag, as: 'tags', where: { id: { [Op.in]: ids } }, through: { attributes: [] }, required: true };
    }
  }

  return {
    where,
    include,
    offset: (p - 1) * l,
    limit: l
  };
}

module.exports = buildBookQuery;
