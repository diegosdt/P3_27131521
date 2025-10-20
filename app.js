var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
        url: 'https://p3-27131521.onrender.com', 
        description: 'Servidor en producción',
      },

      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./app.js'], // archivo donde está la documentación
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


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
// ...existing code...
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
 *             example:
 *               status: success
 *               data:
 *                 nombreCompleto: "Diego Salvador Duarte Tua"
 *                 cedula: "27131521"
 *                 seccion: "Seccion 2"
 */


app.get('/about', function(req, res) {
  // mis datos uwu
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
  res.status(200).end();
});

// Manejo de mis rutas no encontradas
app.use(function(req, res, next) {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint no encontrado'
  });
});




module.exports = app;