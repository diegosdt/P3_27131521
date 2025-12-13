const { sequelize, Book, Order, OrderItem } = require('../models');
const { Book: BookModel, Order: OrderModel } = require('../models');
const { Book: BookAlias } = require('../models');
const db = require('../models');

class OrderService {
  constructor({ paymentStrategies = {} } = {}) {
    this.paymentStrategies = paymentStrategies;
  }

  getPaymentStrategy(name) {
    if (!name) return null;
    if (this.paymentStrategies[name]) return this.paymentStrategies[name];
    const normalize = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
    const lower = normalize(name);
    const foundKey = Object.keys(this.paymentStrategies).find(k => normalize(k) === lower);
    return foundKey ? this.paymentStrategies[foundKey] : null;
  }

  async createOrder({ userId, items = [], paymentMethod, paymentDetails }) {
    if (!items || !items.length) throw new Error('No items');

    const sequelize = require('../config/database');

    // normalize paymentDetails for known payment methods
    function normalizeCardDetails(details = {}) {
      // accept variants and map to API expected names
      const d = {};
      d['full-name'] = details['full-name'] || details.fullName || details.full_name || details['nombre completo'] || details['nombre_completo'] || details.name || '';
      d['card-number'] = details['card-number'] || details.cardNumber || details.card_number || details['número de tarjeta'] || details['numero de tarjeta'] || details['numero_de_tarjeta'] || details.number || '';
      d['expiration-month'] = details['expiration-month'] || details.expirationMonth || details.expiration_month || details['mes de vencimiento'] || details['mes_de_vencimiento'] || details.expMonth || '';
      d['expiration-year'] = details['expiration-year'] || details.expirationYear || details.expiration_year || details['año de caducidad'] || details['ano de caducidad'] || details['año_de_caducidad'] || details.expYear || '';
      d['cvv'] = details.cvv || details.cvc || details.cvv2 || details['cvv'] || '';
      d['currency'] = details.currency || details.curr || details['moneda'] || 'USD';
      return d;
    }

    return await sequelize.transaction(async (t) => {
      // Verify stock and compute total
      let total = 0;
      const products = [];
      for (const it of items) {
        const product = await db.Book.findByPk(it.productId, { transaction: t });
        if (!product) throw new Error(`Product ${it.productId} not found`);
        if (product.stock < it.quantity) throw new Error(`Insufficient stock for product ${product.id}`);
        products.push({ product, quantity: it.quantity });
        total += Number(product.price || 0) * Number(it.quantity);
      }

      // process payment
      const strategy = this.getPaymentStrategy(paymentMethod);
      if (!strategy) throw new Error('Payment method not supported');

      // For CreditCard, normalize and validate required fields expected by the gateway
      let detailsToSend = paymentDetails || {};
      if (String(paymentMethod).toLowerCase() === 'creditcard') {
        const normalized = normalizeCardDetails(paymentDetails || {});
        // check required
        const missing = [];
        if (!normalized['full-name']) missing.push('full-name');
        if (!normalized['card-number']) missing.push('card-number');
        if (!normalized['expiration-month']) missing.push('expiration-month');
        if (!normalized['expiration-year']) missing.push('expiration-year');
        if (!normalized['cvv']) missing.push('cvv');
        if (missing.length) {
          const err = new Error('Invalid payment details: missing ' + missing.join(', '));
          err.code = 'INVALID_PAYMENT_DETAILS';
          throw err;
        }
        detailsToSend = normalized;
      }

      const paymentResult = await strategy.processPayment(Object.assign({}, detailsToSend, { amount: total }));
      if (!paymentResult.success) {
        // Log gateway response for debugging (no API keys)
        try {
          console.error('Payment gateway response:', JSON.stringify(paymentResult, null, 2));
        } catch (logErr) {
          console.error('Payment gateway response (could not stringify):', paymentResult);
        }
        const err = new Error('Payment failed');
        err.payment = paymentResult;
        throw err;
      }

      // update stock
      for (const p of products) {
        p.product.stock = p.product.stock - p.quantity;
        await p.product.save({ transaction: t });
      }

      // create order
      const order = await db.Order.create({ userId, status: 'COMPLETED', totalAmount: total }, { transaction: t });

      // create order items
      for (const p of products) {
        await db.OrderItem.create({ OrderId: order.id, BookId: p.product.id, quantity: p.quantity, unitPrice: p.product.price }, { transaction: t });
      }

      // return created order with items
      const result = await db.Order.findByPk(order.id, { include: [{ model: db.OrderItem, as: 'items', include: [{ model: db.Book, as: 'product' }] }], transaction: t });
      return result;
    });
  }

  async listUserOrders(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const orders = await db.Order.findAndCountAll({ where: { userId }, include: [{ model: db.OrderItem, as: 'items', include: [{ model: db.Book, as: 'product' }] }], limit, offset });
    return orders;
  }

  async getOrder(userId, orderId) {
    const order = await db.Order.findByPk(orderId, { include: [{ model: db.OrderItem, as: 'items', include: [{ model: db.Book, as: 'product' }] }] });
    if (!order) return null;
    if (order.userId !== userId) throw new Error('Forbidden');
    return order;
  }
}

module.exports = OrderService;
