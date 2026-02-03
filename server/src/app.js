import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import router from './routes/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// app.use(
//   helmet({
//     crossOriginOpenerPolicy: false,
//     crossOriginResourcePolicy: false,
//     originAgentCluster: false,
//     strictTransportSecurity: false,
//     contentSecurityPolicy: {
//       directives: {
//         ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//         'upgrade-insecure-requests': null,
//       },
//     },
//   })
// );

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', router);

app.get('/', (_req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Server is running successfully!'
  });
});

app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.use(notFound);
app.use(errorHandler);

export default app;
