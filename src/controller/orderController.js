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
      const { items, paymentMethod, paymentDetails } = req.body;

      // Basic validation of paymentDetails for CreditCard
      if (!paymentMethod) return res.status(400).json({ status: 'fail', message: 'paymentMethod is required' });
      if (String(paymentMethod).toLowerCase() === 'creditcard') {
        if (!paymentDetails || !paymentDetails.cardToken) {
          return res.status(400).json({ status: 'fail', message: 'paymentDetails.cardToken is required for CreditCard payments' });
        }
      }
      const order = await orderService.createOrder({ userId, items, paymentMethod, paymentDetails });
      res.status(201).json({ status: 'success', data: order });
    } catch (err) {
      console.error('ERROR creating order:', err);
      if (err.message && err.message.startsWith('Insufficient stock')) return res.status(400).json({ status: 'fail', message: err.message });
      if (err.message === 'Payment failed') {
        // expose payment errors if available
        const paymentInfo = err.payment || {};
        const detail = paymentInfo.data?.errors || paymentInfo.data || paymentInfo.error || null;
        return res.status(402).json({ status: 'fail', message: 'Payment failed', detail });
      }
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
