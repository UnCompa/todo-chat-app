import { apiReference } from '@scalar/express-api-reference';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { pinoHttp } from 'pino-http';
import mainRouter from 'src/routes/api.js';
import swaggerJSDoc from "swagger-jsdoc";
import { helmetConfig } from './commons/utils/helmet.js';
import { swaggerOptions } from './commons/utils/openapi.js';
dotenv.config({
  override: true,
});

export const app = express();
export const server = createServer(app);

// 🔧 Middlewares globales
app.use(pinoHttp({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
}));

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5473",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

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
app.use('/reference', apiReference({
  url: '/openapi.json',
}));


// 🛑 Error handler (siempre al final)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).json({ error: message });
});

// 🚀 Server start
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
