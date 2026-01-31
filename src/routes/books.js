const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controller/bookController');

// GET público: listado paginado y filtrable de libros
router.get('/', controller.getAll);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Public - Books]
 *     summary: Lista paginada y filtrable de libros (pública)
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Elementos por página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Texto a buscar en título o descripción
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista paginada de libros
 */
/**
 * @swagger
 * /books:
 *   post:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Crea un libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Libro creado
 */
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Actualiza un libro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       200:
 *         description: Libro actualizado
 */
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Elimina un libro
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Libro eliminado
 */
module.exports = router;
