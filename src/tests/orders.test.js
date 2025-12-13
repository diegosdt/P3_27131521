const request = require('supertest');
const app = require('../../app');
const sequelize = require('../config/database');
const db = require('../models');

jest.setTimeout(20000);

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

describe('Orders - transactional checkout', () => {
  test('401 when unauthenticated', async () => {
    const res = await request(app).get('/orders');
    expect(res.statusCode).toBe(401);
  });

  test('successful transaction reduces stock and creates order', async () => {
    // register user
    await request(app).post('/auth/register').send({ fullName: 'T', email: 'a@b.com', password: '123456' });
    const login = await request(app).post('/auth/login').send({ email: 'a@b.com', password: '123456' });
    const token = login.body.data.token;

    // create a category and book
    const cat = await db.Category.create({ name: 'X' });
    const book = await db.Book.create({ title: 'P', author: 'A', publisher: 'B', price: 10, stock: 5, categoryId: cat.id });

    // mock payment strategy to succeed
    const cc = require('../../src/services/payment/creditCardPaymentStrategy');
    jest.spyOn(cc.prototype, 'processPayment').mockResolvedValue({ success: true, data: {} });

    const res = await request(app).post('/orders').set('Authorization', `Bearer ${token}`).send({ items: [{ productId: book.id, quantity: 2 }], paymentMethod: 'CreditCard', paymentDetails: { cardToken: 'tok' } });
    expect(res.statusCode).toBe(201);
    expect(res.body.data.items.length).toBe(1);

    const refreshed = await db.Book.findByPk(book.id);
    expect(refreshed.stock).toBe(3);
  });

  test('rollback on insufficient stock', async () => {
    await request(app).post('/auth/register').send({ fullName: 'U', email: 'u@u.com', password: '123456' });
    const login = await request(app).post('/auth/login').send({ email: 'u@u.com', password: '123456' });
    const token = login.body.data.token;

    const cat = await db.Category.create({ name: 'C' });
    const book1 = await db.Book.create({ title: 'P1', author: 'A', publisher: 'B', price: 5, stock: 1, categoryId: cat.id });
    const book2 = await db.Book.create({ title: 'P2', author: 'A', publisher: 'B', price: 5, stock: 5, categoryId: cat.id });

    const cc = require('../../src/services/payment/creditCardPaymentStrategy');
    jest.spyOn(cc.prototype, 'processPayment').mockResolvedValue({ success: true, data: {} });

    const res = await request(app).post('/orders').set('Authorization', `Bearer ${token}`).send({ items: [{ productId: book1.id, quantity: 2 }, { productId: book2.id, quantity: 1 }], paymentMethod: 'CreditCard', paymentDetails: { cardToken: 'tok' } });
    expect(res.statusCode).toBe(400);

    const b1 = await db.Book.findByPk(book1.id);
    const b2 = await db.Book.findByPk(book2.id);
    expect(b1.stock).toBe(1);
    expect(b2.stock).toBe(5);
  });

  test('rollback on payment failure', async () => {
    await request(app).post('/auth/register').send({ fullName: 'V', email: 'v@v.com', password: '123456' });
    const login = await request(app).post('/auth/login').send({ email: 'v@v.com', password: '123456' });
    const token = login.body.data.token;

    const cat = await db.Category.create({ name: 'C2' });
    const book = await db.Book.create({ title: 'P3', author: 'A', publisher: 'B', price: 20, stock: 3, categoryId: cat.id });

    const cc = require('../../src/services/payment/creditCardPaymentStrategy');
    jest.spyOn(cc.prototype, 'processPayment').mockResolvedValue({ success: false, data: { reason: 'card_declined' } });

    const res = await request(app).post('/orders').set('Authorization', `Bearer ${token}`).send({ items: [{ productId: book.id, quantity: 1 }], paymentMethod: 'CreditCard', paymentDetails: { cardToken: 'tok' } });
    expect(res.statusCode).toBe(402);

    const refreshed = await db.Book.findByPk(book.id);
    expect(refreshed.stock).toBe(3);
  });
});
