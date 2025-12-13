const request = require('supertest');
const app = require('../../app');
const sequelize = require('../config/database');

beforeAll(async () => await sequelize.sync({ force: true }));

describe('Auth endpoints', () => {
  test('Registro exitoso', async () => {
    const res = await request(app).post('/auth/register').send({
      fullName: 'Diego Duarte',
      email: 'diego@test.com',
      password: '123456'
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  test('Login exitoso', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'diego@test.com',
      password: '123456'
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});
