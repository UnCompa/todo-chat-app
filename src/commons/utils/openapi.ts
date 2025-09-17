export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo Colaborativo API',
      version: '1.0.0',
      description: 'API para aplicación de tareas colaborativas en tiempo real',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        SessionCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: 'better-auth.session_token'
        },
      },
      schemas: {
        Task: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            completed: { type: 'boolean' },
          },
          required: ['id', 'title', 'completed']
        }
      }
    }

  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.controller.ts'], // rutas a tus archivos
};
