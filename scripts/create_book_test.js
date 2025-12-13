const http = require('http');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ0ZXN0ZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3NjU2MzUwMDgsImV4cCI6MTc2NTYzODYwOH0.PDFyNFhFWx5go34G41GSBXp86b_00gGHp4ymHfRcViE';
const payload = {
  title: 'Libro prueba',
  author: 'Autor Ej',
  publisher: 'Editorial X',
  price: 19.9,
  stock: 5
};
const data = JSON.stringify(payload);
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/books',
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
