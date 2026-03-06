import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../api/policyApi';
import { DashboardSummary } from '../types/policy';
import { formatCurrency } from '../utils/formatters';

const initialSummary: DashboardSummary = {
  totalPolicies: 0,
  totalCollected: 0,
  pendingInstallments: 0,
  pendingAmount: 0
};

export const DashboardPage = (): JSX.Element => {
  const [summary, setSummary] = useState<DashboardSummary>(initialSummary);

  useEffect(() => {
    void fetchDashboardSummary().then(setSummary);
  }, []);

  return (
    <section>
      <h1>Dashboard</h1>
      <div className="cards-grid">
        <article className="card">
          <h3>Total Policies</h3>
          <p>{summary.totalPolicies}</p>
        </article>
        <article className="card">
          <h3>Total Collected</h3>
          <p>{formatCurrency(summary.totalCollected)}</p>
        </article>
        <article className="card">
          <h3>Pending Installments</h3>
          <p>{summary.pendingInstallments}</p>
        </article>
        <article className="card">
          <h3>Pending Amount</h3>
          <p>{formatCurrency(summary.pendingAmount)}</p>
        </article>
      </div>
    </section>
  );
};
