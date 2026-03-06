import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { dashboardRouter } from './routes/dashboard.routes.js';
import { installmentRouter } from './routes/installment.routes.js';
import { policyRouter } from './routes/policy.routes.js';

export const app = express();

app.use(
  cors({
    origin: env.CLIENT_URL
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ message: 'Service is healthy' });
});

app.use('/api/policies', policyRouter);
app.use('/api/installment', installmentRouter);
app.use('/api/dashboard', dashboardRouter);

app.use(notFoundHandler);
app.use(errorHandler);
