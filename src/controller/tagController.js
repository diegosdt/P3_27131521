const { Tag } = require('../models');

module.exports = {
  async getAll(req, res) {
    try {
      const tags = await Tag.findAll();
      res.status(200).json(tags);
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async create(req, res) {
    try {
      const { name } = req.body;
      if (!name) return res.status(400).json({ mensaje: 'name es requerido' });

      const tag = await Tag.create({ name });
      res.status(201).json(tag);
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const tag = await Tag.findByPk(id);
      if (!tag) return res.status(404).json({ mensaje: 'Etiqueta no encontrada' });

      await tag.update({ name });
      res.status(200).json(tag);
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      const tag = await Tag.findByPk(id);
      if (!tag) return res.status(404).json({ mensaje: 'Etiqueta no encontrada' });

      await tag.destroy();
      res.status(200).json({ mensaje: 'Etiqueta eliminada' });
    } catch {
      res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
  }
};
