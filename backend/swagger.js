const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'NOTNULL Premium API',
    description: 'API documentation for NOTNULL Premium Digital Showroom backend',
    version: '1.0.0'
  },
  servers: [
    {
      url: 'https://notnull-backend.vercel.app',
      description: 'Production Server'
    },
    {
      url: 'http://localhost:5000',
      description: 'Local Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  },
  security: [
    {
      bearerAuth: []
    }
  ]
};

const outputFile = './swagger.json';
const routes = ['./server.js'];

swaggerAutogen(outputFile, routes, doc);
