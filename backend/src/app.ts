import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorHandler } from './middleware/error-handler.middleware.js';
import { notFoundHandler } from './middleware/not-found.middleware.js';
import { installmentRouter } from './routes/installment.routes.js';
import { policyRouter } from './routes/policy.routes.js';

export const app = express();
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

app.get('/api/health', (_req: any, res: any) => {
  res.json({ status: 'ok' });
});
app.use('/api/policies', policyRouter);
app.use('/api/installments', installmentRouter);
app.use(notFoundHandler);
app.use(errorHandler);
