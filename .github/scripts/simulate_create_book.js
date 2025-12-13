const sequelize = require('../src/config/database');
const controller = require('../src/controller/bookController');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conectado a la DB para simulación');

    // Mock req and res
    const req = {
      body: {
        title: 'Libro prueba asociación',
        author: 'Autor X',
        publisher: 'Pub X',
        categoryId: 1,
        tagIds: [1]
      }
    };

    const res = {
      status(code) { this._status = code; return this; },
      json(payload) { console.log('Response status', this._status, JSON.stringify(payload, null, 2)); }
    };

    await controller.create(req, res);
    process.exit(0);
  } catch (err) {
    console.error('Error en simulate_create_book:', err);
    process.exit(1);
  }
})();
