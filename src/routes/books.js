const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controller/bookController');

router.get('/', controller.getPublicList);
router.get('/p/:id-:slug', controller.getPublicBySlug);

router.post('/', auth, controller.create);
router.get('/:id', auth, controller.getById);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);


/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Public - Books]
 *     summary: Lista pública de libros con filtros y paginación
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: price_min
 *         schema: { type: number }
 *       - in: query
 *         name: price_max
 *         schema: { type: number }
 *       - in: query
 *         name: author
 *         schema: { type: string }
 *       - in: query
 *         name: publisher
 *         schema: { type: string }
 *       - in: query
 *         name: publicationYear
 *         schema: { type: integer }
 *       - in: query
 *         name: language
 *         schema: { type: string }
 *       - in: query
 *         name: format
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Lista de libros
 */

/**
 * @swagger
 * /books/p/{id}-{slug}:
 *   get:
 *     tags: [Public - Books]
 *     summary: Obtiene un libro por ID y slug (self-healing)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Libro encontrado
 *       301:
 *         description: Redirección al slug correcto
 */

/**
 * @swagger
 * /books:
 *   post:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Crea un nuevo libro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Libro creado
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene un libro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Libro encontrado
 */

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     summary: Actualiza un libro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
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
 *     summary: Elimina un libro por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Libro eliminado
 */




module.exports = router;
