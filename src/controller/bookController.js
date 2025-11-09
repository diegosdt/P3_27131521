const { Book, Category, Tag } = require('../models');
const { findBooks } = require('../repositories/bookRepository');
const slugify = require('slugify');

exports.create = async (req, res) => {
  const { categoryId, tagIds, ...bookData } = req.body;
  const book = await Book.create({ ...bookData, CategoryId: categoryId });
  if (tagIds) await book.setTags(tagIds);
  res.status(201).json({ status: 'success', data: book });
};

exports.getById = async (req, res) => {
  const book = await Book.findByPk(req.params.id, { include: [Category, Tag] });
  if (!book) return res.status(404).json({ status: 'fail', message: 'Libro no encontrado' });
  res.status(200).json({ status: 'success', data: book });
};

exports.update = async (req, res) => {
  const { categoryId, tagIds, ...bookData } = req.body;
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ status: 'fail', message: 'Libro no encontrado' });
  await book.update({ ...bookData, CategoryId: categoryId });
  if (tagIds) await book.setTags(tagIds);
  res.status(200).json({ status: 'success', data: book });
};

exports.remove = async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (!book) return res.status(404).json({ status: 'fail', message: 'Libro no encontrado' });
  await book.destroy();
  res.status(200).json({ status: 'success', message: 'Libro eliminado' });
};

exports.getPublicBySlug = async (req, res) => {
  const { id, slug } = req.params;
  const book = await Book.findByPk(id);
  if (!book) return res.status(404).json({ status: 'fail', message: 'Libro no encontrado' });

  const correctSlug = slugify(book.title, { lower: true });
  if (slug !== correctSlug) {
    return res.redirect(301, `/p/${book.id}-${correctSlug}`);
  }

  res.status(200).json({ status: 'success', data: book });
};

exports.getPublicList = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await findBooks(req.query, parseInt(page), parseInt(limit));
  res.status(200).json({ status: 'success', data: result });
};
