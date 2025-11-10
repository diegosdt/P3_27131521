const { Book, Category, Tag } = require('../models');

module.exports = {
  async getAll(req, res) {
    try {
      const books = await Book.findAll({
        include: [
          { model: Category, as: 'category' },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });
      res.status(200).json(books);
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async create(req, res) {
    try {
      const {
        title, description, price, stock,
        author, publisher, publicationYear,
        language, format, categoryId, tagIds = []
      } = req.body;

      // Validaciones básicas
      if (!title || !author || !publisher) {
        return res.status(400).json({ mensaje: 'title, author y publisher son requeridos' });
      }
      if (categoryId) {
        const cat = await Category.findByPk(categoryId);
        if (!cat) return res.status(400).json({ mensaje: 'categoryId inválido' });
      }

      const book = await Book.create({
        title, description, price, stock, author, publisher,
        publicationYear, language, format, categoryId
      });

      if (Array.isArray(tagIds) && tagIds.length) {
        const tags = await Tag.findAll({ where: { id: tagIds } });
        await book.setTags(tags);
      }

      const result = await Book.findByPk(book.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });

      res.status(201).json(result);
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const payload = req.body;

      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });

      if (payload.categoryId) {
        const cat = await Category.findByPk(payload.categoryId);
        if (!cat) return res.status(400).json({ mensaje: 'categoryId inválido' });
      }

      await book.update(payload);

      if (Array.isArray(payload.tagIds)) {
        const tags = await Tag.findAll({ where: { id: payload.tagIds } });
        await book.setTags(tags);
      }

      const result = await Book.findByPk(book.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });

      res.status(200).json(result);
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const book = await Book.findByPk(id);
      if (!book) return res.status(404).json({ mensaje: 'Libro no encontrado' });

      await book.destroy();
      res.status(200).json({ mensaje: 'Libro eliminado' });
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
};
