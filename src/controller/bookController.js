// ...existing code...
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
    } catch (err) {
      console.error("ERROR en GET /books:", err);
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

      // Normalizar tagIds a array de números y validar existencia
      let tagIdNums = [];
      if (Array.isArray(tagIds) && tagIds.length) {
        tagIdNums = tagIds.map(id => Number(id)).filter(n => !Number.isNaN(n));
        if (!tagIdNums.length) {
          return res.status(400).json({ mensaje: 'tagIds inválidos' });
        }
        const foundTags = await Tag.findAll({ where: { id: tagIdNums } });
        if (foundTags.length !== tagIdNums.length) {
          return res.status(400).json({ mensaje: 'Al menos un tagId no existe' });
        }
      }

      // Crear libro
      const book = await Book.create({
        title, description, price, stock, author, publisher,
        publicationYear, language, format, categoryId
      });

      // Asociar tags usando instancias (si vienen)
      if (tagIdNums.length) {
        const tags = await Tag.findAll({ where: { id: tagIdNums } });
        await book.setTags(tags);
      }

      // Consultar libro con relaciones
      const result = await Book.findByPk(book.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });

      res.status(201).json(result);
    } catch (err) {
      console.error("ERROR en POST /books:", err);
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

      // Si vienen tagIds, validar y asociar antes/después según necesidad
      if (Array.isArray(payload.tagIds)) {
        const tagIdNums = payload.tagIds.map(x => Number(x)).filter(n => !Number.isNaN(n));
        if (tagIdNums.length) {
          const foundTags = await Tag.findAll({ where: { id: tagIdNums } });
          if (foundTags.length !== tagIdNums.length) {
            return res.status(400).json({ mensaje: 'Al menos un tagId no existe' });
          }
          await book.setTags(foundTags);
        } else {
          // Si llega un array vacío, limpiar asociaciones
          await book.setTags([]);
        }
      }

      await book.update(payload);

      const result = await Book.findByPk(book.id, {
        include: [
          { model: Category, as: 'category' },
          { model: Tag, as: 'tags', through: { attributes: [] } }
        ]
      });

      res.status(200).json(result);
    } catch (err) {
      console.error("ERROR en PUT /books/:id:", err);
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
    } catch (err) {
      console.error("ERROR en DELETE /books/:id:", err);
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
};
// ...existing code...