const http = require('http');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0ZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjU2MzUwMDgsImV4cCI6MTc2NTYzODYwOH0.PDFyNFhFWx5go34G41GSBXp86b_00gGHp4ymHfRcViE';
const payload = {
  "artículos": [
    { "id de producto": 12, "cantidad": 1 }
  ],
  "método de pago": "Tarjeta de crédito",
  "detalles de pago": {
    "número de tarjeta": "4111111111111111",
    "cvv": "123",
    "mes de vencimiento": "01",
    "año de caducidad": "2024",
    "nombre completo": "APROBADO",
    "moneda": "USD",
    "descripción": "Compra de prueba"
  }
};
const data = JSON.stringify(payload);
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/orders',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': 'Bearer ' + token
  },
};

const req = http.request(options, (res) => {
  console.log('status', res.statusCode);
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => { console.log('body:', body); });
});

req.on('error', (e) => { console.error('error', e.message); });
req.write(data);
req.end();
