import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchPolicyById, updatePolicy } from '../api/policyApi';
import { PolicyForm } from '../components/PolicyForm';
import { Policy, PolicyPayload } from '../types/policy';

export const EditPolicyPage = (): JSX.Element => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [policy, setPolicy] = useState<Policy | null>(null);

  useEffect(() => {
    if (!id) return;
    void fetchPolicyById(id).then(setPolicy);
  }, [id]);

  const handleSubmit = async (payload: PolicyPayload): Promise<void> => {
    if (!id) return;
    await updatePolicy(id, payload);
    navigate(`/policies/${id}`);
  };

  if (!policy) return <p>Loading policy...</p>;

  return (
    <section>
      <h1>Edit Policy</h1>
      <PolicyForm initialValues={policy} onSubmit={handleSubmit} submitLabel="Update" />
    </section>
  );
};
