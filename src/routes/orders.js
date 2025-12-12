const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const controller = require('../controller/orderController');

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Gestión de órdenes y checkout
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Crea una orden y procesa el pago (transaccional)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId: { type: integer }
 *                     quantity: { type: integer }
 *               paymentMethod:
 *                 type: string
 *               paymentDetails:
 *                 type: object
 *     responses:
 *       201:
 *         description: Orden creada
 *       400:
 *         description: Error de validación (ej. stock insuficiente)
 */
router.post('/', auth, controller.create);

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Lista paginada de órdenes del usuario autenticado
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de órdenes
 */
router.get('/', auth, controller.list);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Obtiene el detalle de una orden si pertenece al usuario autenticado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de la orden
 *       403:
 *         description: Forbidden
 */
router.get('/:id', auth, controller.get);

module.exports = router;
