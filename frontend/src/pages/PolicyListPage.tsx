import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deletePolicy, fetchPolicies } from '../api/policyApi';
import { Policy } from '../types/policy';
import { formatCurrency, formatDate } from '../utils/formatters';

export const PolicyListPage = (): JSX.Element => {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [search, setSearch] = useState('');

  const loadPolicies = async (searchTerm = ''): Promise<void> => {
    const data = await fetchPolicies(searchTerm);
    setPolicies(data);
  };

  useEffect(() => {
    void loadPolicies();
  }, []);

  return (
    <section>
      <h1>Policies</h1>
      <div className="toolbar">
        <input
          placeholder="Search by number, customer or type"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <button onClick={() => void loadPolicies(search)}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Policy #</th>
            <th>Customer</th>
            <th>Type</th>
            <th>Premium</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr key={policy._id}>
              <td>{policy.policyNumber}</td>
              <td>{policy.customerName}</td>
              <td>{policy.policyType}</td>
              <td>{formatCurrency(policy.premiumAmount)}</td>
              <td>
                {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
              </td>
              <td className="actions">
                <Link to={`/policies/${policy._id}`}>View</Link>
                <Link to={`/policies/${policy._id}/edit`}>Edit</Link>
                <button
                  onClick={async () => {
                    await deletePolicy(policy._id);
                    await loadPolicies(search);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};
