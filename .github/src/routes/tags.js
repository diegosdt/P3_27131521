const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controller/tagController');

router.get('/', auth, controller.getAll);
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

/**
 * @swagger
 * /tags:
 *   get:
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     summary: Lista todas las etiquetas
 *     responses:
 *       200:
 *         description: Lista de etiquetas
 */
/**
 * @swagger
 * /tags:
 *   post:
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     summary: Crea una nueva etiqueta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       201:
 *         description: Etiqueta creada
 */
/**
 * @swagger
 * /tags/{id}:
 *   put:
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     summary: Actualiza una etiqueta
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
 *             $ref: '#/components/schemas/TagInput'
 *     responses:
 *       200:
 *         description: Etiqueta actualizada
 */
/**
 * @swagger
 * /tags/{id}:
 *   delete:
 *     tags: [Admin - Tags]
 *     security:
 *       - bearerAuth: []
 *     summary: Elimina una etiqueta
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Etiqueta eliminada
 */
module.exports = router;

