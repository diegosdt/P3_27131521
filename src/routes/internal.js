const express = require('express');
const router = express.Router();
const internalController = require('../controller/internalController');

// Protection middleware: require x-internal-secret header
router.use((req, res, next) => {
  const secret = process.env.INTERNAL_SECRET;
  if (!secret) return res.status(403).json({ status: 'forbidden' });
  const header = req.headers['x-internal-secret'];
  if (!header || header !== secret) return res.status(403).json({ status: 'forbidden' });
  next();
});

router.get('/seed-status', internalController.seedStatus);
router.post('/create-seed', internalController.createSeed);

module.exports = router;
