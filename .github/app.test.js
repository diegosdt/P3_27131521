const request = require('supertest');
const app = require('../app');

describe('Pruebas de los Endpoints', () => {
  test('GET /ping debería responder con 200', async () => {
    const response = await request(app).get('/ping');
    expect(response.status).toBe(200);
  });

  test('GET /about debería responder con 200 y datos del estudiante', async () => {
    const response = await request(app).get('/about');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
    expect(response.body.data).toHaveProperty('nombreCompleto');
    expect(response.body.data).toHaveProperty('cedula');
    expect(response.body.data).toHaveProperty('seccion');
  });

  test('GET /about debería tener el formato JSend correcto', async () => {
    const response = await request(app).get('/about');
    
    expect(response.body).toEqual({
      status: 'success',
      data: {
        nombreCompleto: expect.any(String),
        cedula: expect.any(String),
        seccion: expect.any(String)
      }
    });
  });
});