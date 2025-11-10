const { Category } = require('../models');

module.exports = {
  async getAll(req, res) {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (err) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async create(req, res) {
    try {
      const { name, description } = req.body;
      if (!name) return res.status(400).json({ mensaje: 'name es requerido' });

      const category = await Category.create({ name, description });
      res.status(201).json(category);
    } catch (err) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

      await category.update({ name, description });
      res.status(200).json(category);
    } catch (err) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id);
      if (!category) return res.status(404).json({ mensaje: 'Categoría no encontrada' });

      await category.destroy();
      res.status(200).json({ mensaje: 'Categoría eliminada' });
    } catch (err) {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
};
