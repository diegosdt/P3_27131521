const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const { secret, expiresIn } = require('../config/jwt');

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    // Validación 
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

    
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword
    });

    
    res.status(201).json({
      status: 'success',
      data: {
        id: user.id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar usuario'
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validación 
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar el usuario
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales inválidas'
      });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'fail',
        message: 'Credenciales inválidas'
      });
    }

    // Generar el token JWT firma digital
    const token = jwt.sign(
      { id: user.id, email: user.email },
      secret,
      { expiresIn }
    );

    // Respuesta exitosa con token
    res.status(200).json({
      status: 'success',
      data: {
        token
      }
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión'
    });
  }
};
