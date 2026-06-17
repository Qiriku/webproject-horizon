const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Horizon Institute API',
            version: '1.0.0',
            description: 'API Documentation for the Horizon Institute Portal and Public site.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local development server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'token',
                    description: 'JWT token stored in HTTP-only cookie',
                },
            },
        },
        security: [
            {
                cookieAuth: [],
            },
        ],
    },
    apis: ['./server/infrastructure/server.js', './server/api/*.js'], 
};

module.exports = swaggerJsdoc(options);
