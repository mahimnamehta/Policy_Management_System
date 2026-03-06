import { Router } from 'express';
import { markInstallmentPaidHandler } from '../controllers/policy.controller.js';

export const installmentRouter = Router();

installmentRouter.put('/:installmentId/pay', markInstallmentPaidHandler);
