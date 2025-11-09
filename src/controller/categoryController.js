const { Category } = require('../models');

exports.getAll = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json({ status: 'success', data: categories });
};

exports.create = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ status: 'success', data: category });
};

exports.update = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ status: 'fail', message: 'Categoría no encontrada' });
  await category.update(req.body);
  res.status(200).json({ status: 'success', data: category });
};

exports.remove = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  if (!category) return res.status(404).json({ status: 'fail', message: 'Categoría no encontrada' });
  await category.destroy();
  res.status(200).json({ status: 'success', message: 'Categoría eliminada' });
};
