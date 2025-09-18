import { setupSocketIO } from '@lib/socker.io.js';
import { apiReference } from '@scalar/express-api-reference';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { pinoHttp } from 'pino-http';
import 'src/commons/config/load-env.js';
import mainRouter from 'src/routes/api.js';
import swaggerJSDoc from 'swagger-jsdoc';
import { helmetConfig } from './commons/utils/helmet.js';
import { swaggerOptions } from './commons/utils/openapi.js';

export const app = express();
export const server = createServer(app);

// 🔧 Middlewares globales
app.use(
  pinoHttp({
    level: 'error',
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  }),
);

app.use(express.json());

app.use(
  cors({
    origin: process.env.TRUSTED_ORIGIN?.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  }),
);

app.use(helmetConfig);

// 🧩 API routes
app.use('/api', mainRouter);

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Endpoint para servir el JSON
app.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Scalar UI
app.use(
  '/reference',
  apiReference({
    url: '/openapi.json',
  }),
);
// 🛑 Error handler (siempre al final)
app.use((err: any, req: Request, res: Response, next: express.NextFunction) => {
  console.error('🔥 Error caught in middleware:', {
    message: err.message,
    status: err.statusCode || 500,
    stack: err.stack,
    url: req.url,
    method: req.method,
    headersSent: res.headersSent,
  });

  // ⚠️ CRÍTICO: Verificar si ya se enviaron los headers
  if (res.headersSent) {
    console.warn('⚠️ Headers ya enviados, delegando al handler por defecto');
    return next(err);
  }

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    statusCode: status,
    name: err.name || 'Error',
    details: err.details || null,
  });
});

// 🚀 Server start
server.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});

export const io = setupSocketIO(server);
