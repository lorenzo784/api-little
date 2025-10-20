import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middlewares/errorHandler.js';
import router from './routes/index.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/api', router);

app.use(notFound);
app.use(errorHandler);

export default app;
