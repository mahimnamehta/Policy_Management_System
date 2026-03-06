import { Router } from 'express';
import { createPolicyHandler, deletePolicyHandler, getPoliciesHandler, updatePolicyHandler } from '../controllers/policy.controller.js';

export const policyRouter = Router();
policyRouter.route('/').get(getPoliciesHandler).post(createPolicyHandler);
policyRouter.route('/:id').put(updatePolicyHandler).delete(deletePolicyHandler);
