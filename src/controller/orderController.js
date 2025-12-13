const OrderService = require('../services/orderService');
const CreditCardPaymentStrategy = require('../services/payment/creditCardPaymentStrategy');
const db = require('../models');

const paymentStrategies = {
  CreditCard: new CreditCardPaymentStrategy()
};

const orderService = new OrderService({ paymentStrategies });

module.exports = {
  async create(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ mensaje: 'No autorizado' });
      // Accept Spanish payload keys and normalize to internal names
      const raw = req.body || {};
      let items = raw.items || raw['artículos'] || raw['articulos'] || [];
      let paymentMethod = raw.paymentMethod || raw['método de pago'] || raw['metodo de pago'] || raw['metododepago'] || raw['metodo'] || raw.method;
      let paymentDetails = raw.paymentDetails || raw['detalles de pago'] || raw['detalles_de_pago'] || raw['detalles'];

      // If spanish payment method names are used, map common values
      if (paymentMethod && typeof paymentMethod === 'string') {
        const pm = paymentMethod.toLowerCase();
        if (pm.includes('tarjeta') || pm.includes('credito') || pm.includes('crédito')) paymentMethod = 'CreditCard';
      }

      // Normalize item keys if they come in Spanish
      if (Array.isArray(items)) {
        items = items.map(it => {
          if (!it) return it;
          const fixed = Object.assign({}, it);
          if (fixed['id de producto'] && !fixed.productId) fixed.productId = fixed['id de producto'];
          if (fixed['id_de_producto'] && !fixed.productId) fixed.productId = fixed['id_de_producto'];
          if (fixed['product_id'] && !fixed.productId) fixed.productId = fixed['product_id'];
          if (fixed['product-id'] && !fixed.productId) fixed.productId = fixed['product-id'];
          if (fixed['cantidad'] && !fixed.quantity) fixed.quantity = fixed['cantidad'];
          if (fixed['qty'] && !fixed.quantity) fixed.quantity = fixed['qty'];
          return fixed;
        });
      }

      // Validate items payload
      if (!Array.isArray(items) || !items.length) {
        return res.status(400).json({ status: 'fail', message: 'Items must be a non-empty array' });
      }
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const pid = Number(it.productId);
        const qty = Number(it.quantity);
        if (!Number.isInteger(pid) || pid <= 0) return res.status(400).json({ status: 'fail', message: `Invalid productId at items[${i}]` });
        if (!Number.isInteger(qty) || qty <= 0) return res.status(400).json({ status: 'fail', message: `Invalid quantity at items[${i}]` });
        // normalize types back
        it.productId = pid;
        it.quantity = qty;
      }

      // Verify user exists
      const user = await db.User.findByPk(userId);
      if (!user) return res.status(401).json({ status: 'fail', message: 'Usuario no encontrado' });

      // Validate supported payment method early to avoid 500s
      const strategy = orderService.getPaymentStrategy(paymentMethod);
      if (!strategy) return res.status(400).json({ status: 'fail', message: 'Payment method not supported' });

      const order = await orderService.createOrder({ userId, items, paymentMethod, paymentDetails });
      res.status(201).json({ status: 'success', data: order });
    } catch (err) {
      console.error('ERROR creating order:', err);
      if (err.message && err.message.startsWith('Insufficient stock')) return res.status(400).json({ status: 'fail', message: err.message });
      if (err.message && /Product \d+ not found/.test(err.message)) return res.status(400).json({ status: 'fail', message: err.message });
      if (err.code === 'INVALID_PAYMENT_DETAILS' || (err.message && err.message.startsWith('Invalid payment details'))) return res.status(400).json({ status: 'fail', message: err.message });
      if (err.message === 'Payment failed') return res.status(402).json({ status: 'fail', message: 'Payment failed', detail: err.payment });
      if (err.message === 'Payment method not supported') return res.status(400).json({ status: 'fail', message: 'Payment method not supported' });
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  },

  async list(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ mensaje: 'No autorizado' });
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await orderService.listUserOrders(userId, page, limit);
      res.status(200).json({ status: 'success', data: result });
    } catch (err) {
      console.error('ERROR listing orders:', err);
      res.status(500).json({ status: 'error' });
    }
  },

  async get(req, res) {
    try {
      const userId = req.user && req.user.id;
      if (!userId) return res.status(401).json({ mensaje: 'No autorizado' });
      const { id } = req.params;
      const order = await orderService.getOrder(userId, id);
      if (!order) return res.status(404).json({ status: 'fail', message: 'Order not found' });
      res.status(200).json({ status: 'success', data: order });
    } catch (err) {
      if (err.message === 'Forbidden') return res.status(403).json({ status: 'fail', message: 'Forbidden' });
      console.error('ERROR getting order:', err);
      res.status(500).json({ status: 'error' });
    }
  }
};
