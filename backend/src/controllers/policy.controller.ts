import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  addInstallment,
  createPolicy,
  deletePolicy,
  getDashboardSummary,
  getInstallmentsByPolicyId,
  getPolicies,
  getPolicyById,
  markInstallmentPaid,
  updatePolicy
} from '../services/policy.service.js';
import { addInstallmentSchema, createPolicySchema, updatePolicySchema } from '../validators/policy.validator.js';

export const createPolicyHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = createPolicySchema.parse(req.body);
    const policy = await createPolicy(payload);
    res.status(StatusCodes.CREATED).json(policy);
  } catch (error) {
    next(error);
  }
};

export const listPoliciesHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const policies = await getPolicies({ search: req.query.search?.toString() });
    res.status(StatusCodes.OK).json(policies);
  } catch (error) {
    next(error);
  }
};

export const getPolicyHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const policy = await getPolicyById(req.params.id);
    res.status(StatusCodes.OK).json(policy);
  } catch (error) {
    next(error);
  }
};

export const updatePolicyHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = updatePolicySchema.parse(req.body);
    const policy = await updatePolicy(req.params.id, payload);
    res.status(StatusCodes.OK).json(policy);
  } catch (error) {
    next(error);
  }
};

export const deletePolicyHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await deletePolicy(req.params.id);
    res.status(StatusCodes.NO_CONTENT).send();
  } catch (error) {
    next(error);
  }
};

export const addInstallmentHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const payload = addInstallmentSchema.parse(req.body);
    const policy = await addInstallment(req.params.id, payload);
    res.status(StatusCodes.CREATED).json(policy);
  } catch (error) {
    next(error);
  }
};

export const markInstallmentPaidHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const policy = await markInstallmentPaid(req.params.installmentId);
    res.status(StatusCodes.OK).json(policy);
  } catch (error) {
    next(error);
  }
};

export const getInstallmentsHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const installments = await getInstallmentsByPolicyId(req.params.id);
    res.status(StatusCodes.OK).json(installments);
  } catch (error) {
    next(error);
  }
};

export const dashboardSummaryHandler = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const summary = await getDashboardSummary();
    res.status(StatusCodes.OK).json(summary);
  } catch (error) {
    next(error);
  }
};
