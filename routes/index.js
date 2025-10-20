var express = require('express');
var router = express.Router();




app.get('/', (req, res) => {
  res.send('API RESTful activa. Visita /about o /api-docs.');
});



module.exports = router;
