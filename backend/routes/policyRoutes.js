import express from 'express';
import {
  createPolicy,
  deletePolicy,
  getPolicies,
  updatePolicy
} from '../controllers/policyController.js';

const router = express.Router();

router.route('/').get(getPolicies).post(createPolicy);
router.route('/:id').put(updatePolicy).delete(deletePolicy);

export default router;
