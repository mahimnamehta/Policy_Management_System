import type { Policy } from '../types/dashboard';

const formatCurrency = (value: number | string): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value || 0));

interface PolicyTableProps {
  loading: boolean;
  policies: Policy[];
  onDelete: (id: string) => void;
  onEdit: (policy: Policy) => void;
}

const PolicyTable = ({ loading, policies, onDelete, onEdit }: PolicyTableProps): JSX.Element => (
  <section className="card dashboard-card h-100">
    <div className="card-body">
      <div className="section-heading"><div><p className="eyebrow">Policy Ledger</p><h3>Portfolio records</h3><p className="section-copy">Review, edit, or remove existing policies from the portfolio.</p></div></div>
      <div className="table-responsive">
        <table className="table policy-table align-middle">
          <thead><tr><th>Policy</th><th>Customer</th><th>Type</th><th>Premium</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan={6} className="text-center py-4">Loading policies...</td></tr>}
            {!loading && policies.length === 0 && <tr><td colSpan={6} className="text-center py-4">No policies found.</td></tr>}
            {!loading && policies.map((policy) => (
              <tr key={policy._id}>
                <td><strong>{policy.policyNumber}</strong><div className="table-subtext">{new Date(policy.startDate).toLocaleDateString()} to {new Date(policy.endDate).toLocaleDateString()}</div></td>
                <td>{policy.customerName}<div className="table-subtext">{policy.email}</div></td>
                <td>{policy.policyType}</td>
                <td>{formatCurrency(policy.premiumAmount)}</td>
                <td><span className={`status-pill status-${policy.status.toLowerCase()}`}>{policy.status}</span></td>
                <td className="text-end"><div className="d-flex justify-content-end gap-2"><button className="btn btn-sm btn-ghost" onClick={() => onEdit(policy)} type="button">Edit</button><button className="btn btn-sm btn-danger-soft" onClick={() => onDelete(policy._id)} type="button">Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export default PolicyTable;
