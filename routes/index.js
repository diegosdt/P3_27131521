var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/', (req, res) => {
  res.send('API RESTful activa. Visita /about o /api-docs.');
});



module.exports = router;
