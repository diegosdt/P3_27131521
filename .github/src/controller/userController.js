const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'fullName', 'email'] });
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    console.error('Error en getUsers:', err);
    res.status(500).json({ status: 'error', message: 'Error al obtener usuarios' });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: ['id', 'fullName', 'email'] });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
    }
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    console.error('Error en getUserById:', err);
    res.status(500).json({ status: 'error', message: 'Error al obtener usuario' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Todos los campos son obligatorios: fullName, email, password'
      });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email ya registrado'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword });

    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en createUser:', err);
    res.status(500).json({ status: 'error', message: 'Error al crear usuario' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
    }

    await user.update({ fullName, email });
    res.status(200).json({
      status: 'success',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en updateUser:', err);
    res.status(500).json({ status: 'error', message: 'Error al actualizar usuario' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
    }

    await user.destroy();
    res.status(200).json({ status: 'success', message: 'Usuario eliminado' });
  } catch (err) {
    console.error('Error en deleteUser:', err);
    res.status(500).json({ status: 'error', message: 'Error al eliminar usuario' });
  }
};
