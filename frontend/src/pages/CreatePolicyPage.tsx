import { useNavigate } from 'react-router-dom';
import { createPolicy } from '../api/policyApi';
import { PolicyForm } from '../components/PolicyForm';
import { PolicyPayload } from '../types/policy';

export const CreatePolicyPage = (): JSX.Element => {
  const navigate = useNavigate();

  const handleSubmit = async (payload: PolicyPayload): Promise<void> => {
    await createPolicy(payload);
    navigate('/policies');
  };

  return (
    <section>
      <h1>Create Policy</h1>
      <PolicyForm onSubmit={handleSubmit} submitLabel="Create" />
    </section>
  );
};
