var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Configuración COMPLETA de CORS para Swagger
app.use(cors({
  origin: true, // Permite el origen actual
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Manejar preflight requests explícitamente
app.options('*', cors());

// Configuración de Swagger
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API P3 - Cédula',
      version: '1.0.0',
      description: 'API RESTful para el proyecto P3',
    },
    servers: [
      {
        url: 'http://localhost:3000', // ⚠️ PON PRIMERO LOCALHOST para desarrollo
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://nombre-del-servicio.onrender.com',
        description: 'Servidor en producción',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// ✅ Configuración específica para Swagger UI con CORS
app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      url: '/swagger.json', // Usar archivo local en lugar de fetch
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API P3 - Documentación"
  })(req, res, next);
});

// ✅ Ruta para servir el spec de Swagger como JSON local
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

/**
 * @swagger
 * components:
 *   schemas:
 *     AboutResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           example: success
 *         data:
 *           type: object
 *           properties:
 *             nombreCompleto:
 *               type: string
 *             cedula:
 *               type: string
 *             seccion:
 *               type: string
 *       example:
 *         status: success
 *         data:
 *           nombreCompleto: "Diego Salvador Duarte Tua"
 *           cedula: "27131521"
 *           seccion: "Seccion 2"
 */

/**
 * @swagger
 * /about:
 *   get:
 *     summary: Obtiene información del estudiante
 *     description: Retorna nombre completo, cédula y sección del estudiante
 *     responses:
 *       200:
 *         description: Información del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AboutResponse'
 */
app.get('/about', function(req, res) {
  const studentInfo = {
    status: 'success',
    data: {
      nombreCompleto: 'Diego Salvador Duarte Tua',
      cedula: '27131521',
      seccion: 'Seccion 2'
    }
  };
  res.json(studentInfo);
});

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica el estado del servidor
 *     description: Retorna un estado 200 si el servidor está funcionando
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 */
app.get('/ping', function(req, res) {
  res.status(200).json({ estado: '200 OK' });
});

// Manejo de rutas no encontradas
app.use(function(req, res, next) {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado'
  });
});

// Manejo de errores global
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

module.exports = app;