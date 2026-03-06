import express from 'express';
import {
  createInstallmentPlan,
  getInstallmentPlans,
  markInstallmentPaid
} from '../controllers/installmentController.js';

const router = express.Router();

router.route('/').get(getInstallmentPlans).post(createInstallmentPlan);
router.patch('/:id/pay/:installmentNumber', markInstallmentPaid);

export default router;
