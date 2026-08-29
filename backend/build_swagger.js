const fs = require('fs');
const swagger = require('./swagger.json');

swagger.paths['/api/customers'] = {
  get: {
    tags: ['Customers'],
    summary: 'Get all customers (Admin/Sales)',
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'List of customers' } }
  },
  post: {
    tags: ['Customers'],
    summary: 'Create a new customer',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { fullName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, address: { type: 'string' } } } } }
    },
    responses: { 201: { description: 'Customer created' } }
  }
};

swagger.paths['/api/transactions'] = {
  get: {
    tags: ['Transactions'],
    summary: 'Get all transactions',
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'List of transactions' } }
  },
  post: {
    tags: ['Transactions'],
    summary: 'Create a transaction',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { carId: { type: 'integer' }, amount: { type: 'number' }, paymentMethod: { type: 'string' } } } } }
    },
    responses: { 201: { description: 'Transaction created' } }
  }
};

swagger.paths['/api/transactions/{id}/status'] = {
  put: {
    tags: ['Transactions'],
    summary: 'Update transaction status',
    security: [{ bearerAuth: [] }],
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'COMPLETED' } } } } }
    },
    responses: { 200: { description: 'Status updated' } }
  }
};

swagger.paths['/api/brands'] = {
  get: {
    tags: ['Brands'],
    summary: 'Get all brands',
    responses: { 200: { description: 'List of brands' } }
  },
  post: {
    tags: ['Brands'],
    summary: 'Create a brand (Admin)',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, logoUrl: { type: 'string' } } } } }
    },
    responses: { 201: { description: 'Brand created' } }
  }
};

swagger.paths['/api/trade-in'] = {
  get: {
    tags: ['Trade-In'],
    summary: 'Get all trade-ins (Admin/Sales)',
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'List of trade-in requests' } }
  },
  post: {
    tags: ['Trade-In'],
    summary: 'Create a trade-in request',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: { 'application/json': { schema: { type: 'object', properties: { carBrand: { type: 'string' }, carModel: { type: 'string' }, year: { type: 'integer' }, targetCarId: { type: 'integer' } } } } }
    },
    responses: { 201: { description: 'Trade-in requested' } }
  }
};

fs.writeFileSync('./swagger.json', JSON.stringify(swagger, null, 2));
console.log('Swagger updated manually.');
