import { Router } from 'express';
import {
  addInstallmentHandler,
  createPolicyHandler,
  deletePolicyHandler,
  getInstallmentsHandler,
  getPolicyHandler,
  listPoliciesHandler,
  updatePolicyHandler
} from '../controllers/policy.controller.js';

export const policyRouter = Router();

policyRouter.post('/', createPolicyHandler);
policyRouter.get('/', listPoliciesHandler);
policyRouter.get('/:id', getPolicyHandler);
policyRouter.put('/:id', updatePolicyHandler);
policyRouter.delete('/:id', deletePolicyHandler);
policyRouter.post('/:id/installment', addInstallmentHandler);
policyRouter.get('/:id/installments', getInstallmentsHandler);
