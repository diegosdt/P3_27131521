const db = require('../models');

exports.seedStatus = async (req, res) => {
  try {
    const email = req.query.email || process.env.SEED_EMAIL || 'tester@example.com';
    const user = await db.User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ status: 'not_found', email });
    return res.status(200).json({ status: 'ok', user: { id: user.id, email: user.email, fullName: user.fullName, createdAt: user.createdAt } });
  } catch (err) {
    console.error('Error fetching seed status:', err);
    return res.status(500).json({ status: 'error' });
  }
};

exports.createSeed = async (req, res) => {
  try {
    const email = req.body.email || process.env.SEED_EMAIL || 'tester@example.com';
    const password = req.body.password || process.env.SEED_PASSWORD || 'Test1234';
    const fullName = req.body.fullName || process.env.SEED_FULLNAME || 'Tester';
    const createSeedUser = require('../../scripts/create_seed_user');
    const result = await createSeedUser({ email, password, fullName });
    return res.status(200).json({ status: 'ok', user: { id: result.user.id, email: result.user.email }, token: result.token });
  } catch (err) {
    console.error('Error creating seed user via internal endpoint:', err);
    return res.status(500).json({ status: 'error' });
  }
};
