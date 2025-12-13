const http = require('http');
const data = JSON.stringify({ foo: 'bar' });
const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/ping',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
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
