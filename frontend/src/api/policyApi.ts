import { apiClient } from './client';
import { DashboardSummary, Installment, Policy, PolicyPayload } from '../types/policy';

export const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const { data } = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return data;
};

export const fetchPolicies = async (search = ''): Promise<Policy[]> => {
  const { data } = await apiClient.get<Policy[]>('/policies', { params: { search } });
  return data;
};

export const fetchPolicyById = async (id: string): Promise<Policy> => {
  const { data } = await apiClient.get<Policy>(`/policies/${id}`);
  return data;
};

export const createPolicy = async (payload: PolicyPayload): Promise<Policy> => {
  const { data } = await apiClient.post<Policy>('/policies', payload);
  return data;
};

export const updatePolicy = async (id: string, payload: Partial<PolicyPayload>): Promise<Policy> => {
  const { data } = await apiClient.put<Policy>(`/policies/${id}`, payload);
  return data;
};

export const deletePolicy = async (id: string): Promise<void> => {
  await apiClient.delete(`/policies/${id}`);
};

export const fetchInstallments = async (policyId: string): Promise<Installment[]> => {
  const { data } = await apiClient.get<Installment[]>(`/policies/${policyId}/installments`);
  return data;
};

export const addInstallment = async (policyId: string, payload: Pick<Installment, 'dueDate' | 'amount'>): Promise<Policy> => {
  const { data } = await apiClient.post<Policy>(`/policies/${policyId}/installment`, payload);
  return data;
};

export const markInstallmentPaid = async (installmentId: string): Promise<Policy> => {
  const { data } = await apiClient.put<Policy>(`/installment/${installmentId}/pay`);
  return data;
};
