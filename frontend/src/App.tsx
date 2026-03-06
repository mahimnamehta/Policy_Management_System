import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { installmentApi, policyApi } from './api/policyApi';
import AlertMessage from './components/AlertMessage';
import InstallmentManager from './components/InstallmentManager';
import PolicyForm from './components/PolicyForm';
import PolicyTable from './components/PolicyTable';
import StatCard from './components/StatCard';
import type { AlertState, InstallmentFormData, InstallmentPlan, Policy, PolicyFormData } from './types/dashboard';

const emptyPolicyForm: PolicyFormData = { policyNumber: '', customerName: '', email: '', phone: '', policyType: 'Health', coverageAmount: '', premiumAmount: '', startDate: '', endDate: '', status: 'Pending', notes: '' };

const App = (): JSX.Element => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>([]);
  const [policyForm, setPolicyForm] = useState<PolicyFormData>(emptyPolicyForm);
  const [editingPolicyId, setEditingPolicyId] = useState('');
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [loading, setLoading] = useState(true);

  const showAlert = (type: AlertState['type'], message: string): void => setAlert({ type, message });
  const clearAlert = (): void => setAlert(null);

  const loadDashboardData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [policyResponse, installmentResponse] = await Promise.all([policyApi.getAll(), installmentApi.getAll()]);
      setPolicies(policyResponse.data);
      setInstallmentPlans(installmentResponse.data);
    } catch (error: any) {
      showAlert('danger', error.response?.data?.message || 'Failed to load dashboard data');
    } finally { setLoading(false); }
  };

  useEffect(() => { void loadDashboardData(); }, []);

  const resetPolicyForm = (): void => { setPolicyForm(emptyPolicyForm); setEditingPolicyId(''); };

  const handlePolicyChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;
    setPolicyForm((current) => ({ ...current, [name]: value }));
  };

  const handlePolicySubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    try {
      if (editingPolicyId) {
        const response = await policyApi.update(editingPolicyId, policyForm);
        setPolicies((current) => current.map((policy) => (policy._id === editingPolicyId ? response.data : policy)));
        showAlert('success', 'Policy updated successfully');
      } else {
        const response = await policyApi.create(policyForm);
        setPolicies((current) => [response.data, ...current]);
        showAlert('success', 'Policy created successfully');
      }
      resetPolicyForm();
    } catch (error: any) {
      showAlert('danger', error.response?.data?.error || 'Failed to save policy');
    }
  };

  const handleEditPolicy = (policy: Policy): void => {
    setEditingPolicyId(policy._id);
    setPolicyForm({ ...policyForm, policyNumber: policy.policyNumber, customerName: policy.customerName, email: policy.email, phone: policy.phone, policyType: policy.policyType, coverageAmount: policy.coverageAmount, premiumAmount: policy.premiumAmount, startDate: policy.startDate?.slice(0, 10), endDate: policy.endDate?.slice(0, 10), status: policy.status, notes: policy.notes || '' });
    clearAlert();
  };

  const handleDeletePolicy = async (policyId: string): Promise<void> => {
    try {
      await policyApi.remove(policyId);
      setPolicies((current) => current.filter((policy) => policy._id !== policyId));
      setInstallmentPlans((current) => current.filter((plan) => {
        const planPolicyId = typeof plan.policy === 'string' ? plan.policy : plan.policy?._id;
        return planPolicyId !== policyId;
      }));
      if (editingPolicyId === policyId) { resetPolicyForm(); }
      showAlert('success', 'Policy deleted successfully');
    } catch (error: any) {
      showAlert('danger', error.response?.data?.message || 'Failed to delete policy');
    }
  };

  const handleCreateInstallmentPlan = async (payload: InstallmentFormData): Promise<void> => {
    try {
      const response = await installmentApi.create(payload);
      setInstallmentPlans((current) => [response.data, ...current]);
      showAlert('success', 'Installment plan created successfully');
    } catch (error: any) {
      showAlert('danger', error.response?.data?.error || 'Failed to create installment plan');
      throw error;
    }
  };

  const handleMarkInstallmentPaid = async (planId: string, installmentNumber: number): Promise<void> => {
    try {
      const response = await installmentApi.markPaid(planId, installmentNumber);
      setInstallmentPlans((current) => current.map((plan) => (plan._id === planId ? response.data : plan)));
      showAlert('success', `Installment ${installmentNumber} marked as paid`);
    } catch (error: any) {
      showAlert('danger', error.response?.data?.error || 'Failed to update installment');
    }
  };

  const activePolicies = policies.filter((policy) => policy.status === 'Active').length;
  const totalPremium = policies.reduce((sum, policy) => sum + Number(policy.premiumAmount || 0), 0);
  const pendingPolicies = policies.filter((policy) => policy.status === 'Pending').length;
  const paidInstallments = installmentPlans.reduce((sum, plan) => sum + plan.installments.filter((i) => i.status === 'Paid').length, 0);
  const totalCollected = installmentPlans.reduce((sum, plan) => sum + plan.installments.reduce((s, i) => (i.status === 'Paid' ? s + Number(i.amount) : s), 0), 0);

  return (
    <div className="app-shell"><div className="ambient-orb ambient-orb-left" /><div className="ambient-orb ambient-orb-right" />
      <main className="dashboard-shell"><section className="masthead"><div className="masthead-copy"><p className="eyebrow">Insurance Operations</p><h1>Policy command center for admin, billing, and renewals.</h1><p className="masthead-text">Create policies, maintain customer records, and run installment payment tracking from a single dashboard.</p><div className="hero-chip-row"><span className="hero-chip">Policy CRUD</span><span className="hero-chip">Installment plans</span><span className="hero-chip">Payment updates</span></div></div><div className="masthead-spotlight"><p className="eyebrow">Booked premium</p><strong>${totalPremium.toFixed(2)}</strong><span>{installmentPlans.length} installment plans in pipeline</span><div className="spotlight-divider" /><div className="spotlight-grid"><div><small>Collected</small><b>${totalCollected.toFixed(2)}</b></div><div><small>Active</small><b>{activePolicies}</b></div></div></div></section>
      <section className="metrics-grid"><StatCard label="Total Policies" value={policies.length} note="Overall portfolio" tone="sand" /><StatCard label="Active Policies" value={activePolicies} note="Currently in force" tone="teal" /><StatCard label="Pending Policies" value={pendingPolicies} note="Need follow-up or approval" tone="amber" /><StatCard label="Paid Installments" value={paidInstallments} note="Recorded payment entries" tone="slate" /></section>
      {alert && <AlertMessage alert={alert} onClose={clearAlert} />}
      <div className="row g-4 align-items-stretch"><div className="col-12 col-xl-5"><PolicyForm formData={policyForm} isEditing={Boolean(editingPolicyId)} onCancel={resetPolicyForm} onChange={handlePolicyChange} onSubmit={handlePolicySubmit} /></div><div className="col-12 col-xl-7"><PolicyTable loading={loading} policies={policies} onDelete={handleDeletePolicy} onEdit={handleEditPolicy} /></div></div>
      <section className="section-spacer"><InstallmentManager installmentPlans={installmentPlans} loading={loading} policies={policies} onCreate={handleCreateInstallmentPlan} onMarkPaid={handleMarkInstallmentPaid} /></section></main>
    </div>
  );
};

export default App;
