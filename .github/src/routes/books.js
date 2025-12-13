const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controller/bookController');

router.get('/', auth, controller.getAll);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Lista todos los libros
 *     responses:
 *       200:
 *         description: Lista de libros
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
