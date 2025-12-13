const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../src/models');
const { secret, expiresIn } = require('../src/config/jwt');

async function createSeedUser({ email = 'tester@example.com', password = 'Test1234', fullName = 'Tester' } = {}) {
  try {
    await require('../src/config/database').authenticate();
    let user = await db.User.findOne({ where: { email } });
    if (!user) {
      const hash = await bcrypt.hash(password, 10);
      user = await db.User.create({ fullName, email, password: hash });
      console.log('User created:', email);
    } else {
      console.log('User exists:', email);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn });
    console.log('Use this token to authenticate requests:');
    console.log(token);
    return { user, token };
  } catch (err) {
    console.error('Error creating seed user:', err);
    throw err;
  }
}

if (require.main === module) {
  // If run directly, execute and exit accordingly
  createSeedUser().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = createSeedUser;
