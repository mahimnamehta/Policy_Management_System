import { Router } from 'express';
import { dashboardSummaryHandler } from '../controllers/policy.controller.js';

export const dashboardRouter = Router();

dashboardRouter.get('/summary', dashboardSummaryHandler);
