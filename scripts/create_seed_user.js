const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../src/models');
const { secret, expiresIn } = require('../src/config/jwt');

(async () => {
  try {
    await require('../src/config/database').authenticate();
    const email = 'tester@example.com';
    const password = 'Test1234';
    let user = await db.User.findOne({ where: { email } });
    if (!user) {
      const hash = await bcrypt.hash(password, 10);
      user = await db.User.create({ fullName: 'Tester', email, password: hash });
      console.log('User created:', email);
    } else {
      console.log('User exists:', email);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });
    console.log('Use this token to authenticate requests:');
    console.log(token);
    process.exit(0);
  } catch (err) {
    console.error('Error creating seed user:', err);
    process.exit(1);
  }
})();
