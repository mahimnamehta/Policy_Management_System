import axios, { type AxiosResponse } from 'axios';
import type { InstallmentFormData, InstallmentPlan, Policy, PolicyFormData } from '../types/dashboard';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
});

export const policyApi = {
  getAll: (): Promise<AxiosResponse<Policy[]>> => api.get('/policies'),
  create: (payload: PolicyFormData): Promise<AxiosResponse<Policy>> => api.post('/policies', payload),
  update: (id: string, payload: PolicyFormData): Promise<AxiosResponse<Policy>> => api.put(`/policies/${id}`, payload),
  remove: (id: string): Promise<AxiosResponse<{ message: string }>> => api.delete(`/policies/${id}`)
};

export const installmentApi = {
  getAll: (): Promise<AxiosResponse<InstallmentPlan[]>> => api.get('/installments'),
  create: (payload: InstallmentFormData): Promise<AxiosResponse<InstallmentPlan>> => api.post('/installments', payload),
  markPaid: (id: string, installmentNumber: number): Promise<AxiosResponse<InstallmentPlan>> =>
    api.patch(`/installments/${id}/pay/${installmentNumber}`)
};

export default api;
