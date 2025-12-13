const request = require('supertest');
const sequelize = require('../config/database');

let app;
beforeAll(async () => {
  // Ensure models are registered with the Sequelize instance before syncing
  require('../models');
  await sequelize.sync({ force: true });
  // Diagnostics
  console.log('TEST diagnostics: JEST_WORKER_ID=', process.env.JEST_WORKER_ID, 'NODE_ENV=', process.env.NODE_ENV);
  try { console.log('Sequelize storage path:', sequelize.options && sequelize.options.storage); } catch(e) {}
  // require app after DB is ready to avoid race conditions
  app = require('../../app');
});

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
