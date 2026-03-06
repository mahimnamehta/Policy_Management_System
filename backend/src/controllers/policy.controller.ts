import {
  createInstallmentPlan,
  createPolicy,
  deletePolicy,
  getInstallmentPlans,
  getPolicies,
  markInstallmentPaid,
  updatePolicy
} from '../services/policy.service.js';
import {
  validateCreateInstallmentPlan,
  validateCreatePolicy,
  validateMarkInstallmentPaid,
  validateUpdatePolicy
} from '../validators/policy.validator.js';

export const getPoliciesHandler = async (_req: any, res: any, next: any): Promise<void> => {
  try { res.status(200).json(await getPolicies()); } catch (error) { next(error); }
};

export const createPolicyHandler = async (req: any, res: any, next: any): Promise<void> => {
  try { res.status(201).json(await createPolicy(validateCreatePolicy(req.body))); } catch (error) { next(error); }
};

export const updatePolicyHandler = async (req: any, res: any, next: any): Promise<void> => {
  try { res.status(200).json(await updatePolicy(req.params.id, validateUpdatePolicy(req.body))); } catch (error) { next(error); }
};

export const deletePolicyHandler = async (req: any, res: any, next: any): Promise<void> => {
  try { await deletePolicy(req.params.id); res.status(200).json({ message: 'Policy deleted successfully' }); } catch (error) { next(error); }
};

export const getInstallmentsHandler = async (_req: any, res: any, next: any): Promise<void> => {
  try { res.status(200).json(await getInstallmentPlans()); } catch (error) { next(error); }
};

export const createInstallmentHandler = async (req: any, res: any, next: any): Promise<void> => {
  try { res.status(201).json(await createInstallmentPlan(validateCreateInstallmentPlan(req.body))); } catch (error) { next(error); }
};

export const markInstallmentPaidHandler = async (req: any, res: any, next: any): Promise<void> => {
  try {
    const params = validateMarkInstallmentPaid(req.params);
    console.log(params,'params installments');
    res.status(200).json(await markInstallmentPaid(params.id, params.installmentNumber));
  } catch (error) { next(error); }
};
