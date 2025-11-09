const { Tag } = require('../models');

exports.getAll = async (req, res) => {
  const tags = await Tag.findAll();
  res.status(200).json({ status: 'success', data: tags });
};

exports.create = async (req, res) => {
  const tag = await Tag.create(req.body);
  res.status(201).json({ status: 'success', data: tag });
};

exports.update = async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ status: 'fail', message: 'Etiqueta no encontrada' });
  await tag.update(req.body);
  res.status(200).json({ status: 'success', data: tag });
};

exports.remove = async (req, res) => {
  const tag = await Tag.findByPk(req.params.id);
  if (!tag) return res.status(404).json({ status: 'fail', message: 'Etiqueta no encontrada' });
  await tag.destroy();
  res.status(200).json({ status: 'success', message: 'Etiqueta eliminada' });
};
