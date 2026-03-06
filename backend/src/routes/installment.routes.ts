import { Router } from 'express';
import { createInstallmentHandler, getInstallmentsHandler, markInstallmentPaidHandler } from '../controllers/policy.controller.js';

export const installmentRouter = Router();
installmentRouter.route('/').get(getInstallmentsHandler).post(createInstallmentHandler);
installmentRouter.patch('/:id/pay/:installmentNumber', markInstallmentPaidHandler);
