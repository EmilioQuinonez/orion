import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import apiRouter from './routes/index.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/api', apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export { app };
