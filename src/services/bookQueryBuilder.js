// src/builders/BookQueryBuilder.js

class BookQueryBuilder {
  constructor() {
    this.query = {
      where: {},
      offset: 0,
      limit: 10,
      include: ['category', 'tags'], // relaciones
    };
  }

  applyPagination(page, limit) {
    const p = Number(page) || 1;
    const l = Number(limit) || 10;
    this.query.offset = (p - 1) * l;
    this.query.limit = l;
    return this;
  }

  applySearch(search) {
    if (search) {
      this.query.where.title = { [Op.like]: `%${search}%` };
      this.query.where.description = { [Op.like]: `%${search}%` };
    }
    return this;
  }

  applyCategory(categoryId) {
    if (categoryId) {
      this.query.where.categoryId = Number(categoryId);
    }
    return this;
  }

  applyTags(tagIds) {
    if (tagIds && Array.isArray(tagIds)) {
      this.query.where.tagIds = { [Op.in]: tagIds.map(Number) };
    }
    return this;
  }

  applyPriceRange(min, max) {
    if (min || max) {
      this.query.where.price = {};
      if (min) this.query.where.price[Op.gte] = Number(min);
      if (max) this.query.where.price[Op.lte] = Number(max);
    }
    return this;
  }

  applyCustomFilters({ publisher, language, format }) {
    if (publisher) this.query.where.publisher = { [Op.like]: `%${publisher}%` };
    if (language) this.query.where.language = { [Op.like]: `%${language}%` };
    if (format) this.query.where.format = { [Op.like]: `%${format}%` };
    return this;
  }

  build() {
    return this.query;
  }
}

module.exports = BookQueryBuilder;
