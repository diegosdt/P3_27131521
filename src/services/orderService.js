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
    const lower = String(name).toLowerCase();
    const foundKey = Object.keys(this.paymentStrategies).find(k => k.toLowerCase() === lower);
    return foundKey ? this.paymentStrategies[foundKey] : null;
  }

  async createOrder({ userId, items = [], paymentMethod, paymentDetails }) {
    if (!items || !items.length) throw new Error('No items');

    const sequelize = require('../config/database');

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

      const paymentResult = await strategy.processPayment(Object.assign({}, paymentDetails, { amount: total }));
      if (!paymentResult.success) {
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
