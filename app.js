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

//Configuración de CORS
app.use(cors({
  origin: 'https://p3-27131521.onrender.com/', 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));


app.options('*', cors());

// Configuración de Swagger :D
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
        url: 'https://p3-27131521.onrender.com/', // mi servidor de uso. tenia el local pero como lo subi a render lo borre y solo deje render para que no haya confusion 
        description: 'Servidor en producción',
      },
    ],
  },
  apis: ['./app.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use('/api-docs', swaggerUi.serve, (req, res, next) => {
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      spec: swaggerSpec,
      persistAuthorization: true,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "API P3 - Documentación"
  })(req, res, next);
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

// Manejo de errores globales
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
});

module.exports = app;
