const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const sequelize = require('./src/config/database');
// Importar modelos para que se registren en la instancia de sequelize
require('./src/models');

// Sincronización de la base de datos
// En entorno de test dejamos que los tests controlen el `sync` para evitar
// condiciones de carrera entre `beforeAll` en los tests y el `sync` asíncrono
// que ocurre al requerir `app`. En otros entornos ejecutamos el sync automáticamente.
if (process.env.NODE_ENV !== 'test') {
  // Por seguridad no ejecutamos `alter: true` por defecto al iniciar.
  // Si realmente quieres aplicar alteraciones automáticas, exporta
  // la variable de entorno `DB_ALTER=true` (solo en desarrollo).
  const syncOptions = process.env.DB_ALTER === 'true' ? { alter: true } : {};
  sequelize.sync(syncOptions)
    .then(() => console.log('Base de datos sincronizada'))
    .catch(err => console.error('Error al sincronizar DB:', err));
}

const app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Capturar errores de JSON mal formado y devolver 400 legible
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ status: 'fail', message: 'Malformed JSON in request body' });
  }
  next();
});
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS para desarrollo y producción
app.use(cors({
  origin: ['https://p3-27131521.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.options('*', cors());

// Rutas principales
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const bookRoutes = require('./src/routes/books');
const categoryRoutes = require('./src/routes/categories');
const tagRoutes = require('./src/routes/tags');
const orderRoutes = require('./src/routes/orders');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/categories', categoryRoutes);
app.use('/tags', tagRoutes);
app.use('/orders', orderRoutes);

// Swagger
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
    tags: [
      { name: 'Admin - Books', description: 'Gestión de libros (CRUD protegido)' },
      { name: 'Public - Books', description: 'Consulta pública de libros (listado y self-healing)' },
      { name: 'Admin - Categories', description: 'Gestión de categorías (CRUD protegido)' },
      { name: 'Admin - Tags', description: 'Gestión de etiquetas (CRUD protegido)' },
      { name: 'Orders', description: 'Gestión de órdenes y checkout' }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Book: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            author: { type: 'string' },
            publisher: { type: 'string' },
            publicationYear: { type: 'integer' },
            language: { type: 'string' },
            format: { type: 'string' },
            slug: { type: 'string' },
            CategoryId: { type: 'integer' },
            Tags: {
              type: 'array',
              items: { $ref: '#/components/schemas/Tag' }
            }
          }
        },
        BookInput: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            stock: { type: 'integer' },
            author: { type: 'string' },
            publisher: { type: 'string' },
            publicationYear: { type: 'integer' },
            language: { type: 'string' },
            format: { type: 'string' },
            categoryId: { type: 'integer' },
            tagIds: {
              type: 'array',
              items: { type: 'integer' }
            }
          },
          required: ['title', 'price', 'stock', 'author', 'publisher'],
          example: {
            title: "Cien años de soledad",
            description: "Novela de Gabriel García Márquez",
            price: 25.99,
            stock: 10,
            author: "Gabriel García Márquez",
            publisher: "Sudamericana",
            publicationYear: 1967,
            language: "Español",
            format: "Tapa dura",
            categoryId: 1,
            category: "novela",
            tagIds: [2, 3]
          }
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        },
        CategoryInput: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' }
          },
          required: ['name'],
          example: {
            name: "Novela",
            description: "Libros narrativos"
          }
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          }
        },
        TagInput: {
          type: 'object',
          properties: {
            name: { type: 'string' }
          },
          required: ['name'],
          example: {
            name: "Realismo mágico"
          }
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            status: { type: 'string' },
            totalAmount: { type: 'number' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/OrderItem' }
            }
          }
        },
        OrderItem: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            OrderId: { type: 'integer' },
            BookId: { type: 'integer' },
            quantity: { type: 'integer' },
            unitPrice: { type: 'number' }
          }
        },
        AboutResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            data: {
              type: 'object',
              properties: {
                nombreCompleto: { type: 'string' },
                cedula: { type: 'string' },
                seccion: { type: 'string' }
              }
            }
          },
          example: {
            status: 'success',
            data: {
              nombreCompleto: 'Diego Salvador Duarte Tua',
              cedula: '27131521',
              seccion: 'Seccion 2'
            }
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  },
  apis: ['./app.js', './src/routes/*.js']
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
  res.json({
    status: 'success',
    data: {
      nombreCompleto: 'Diego Salvador Duarte Tua',
      cedula: '27131521',
      seccion: 'Seccion 2'
    }
  });
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
