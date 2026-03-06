import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { CreatePolicyPage } from './pages/CreatePolicyPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditPolicyPage } from './pages/EditPolicyPage';
import { PolicyDetailsPage } from './pages/PolicyDetailsPage';
import { PolicyListPage } from './pages/PolicyListPage';

export const App = (): JSX.Element => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/policies" element={<PolicyListPage />} />
      <Route path="/policies/new" element={<CreatePolicyPage />} />
      <Route path="/policies/:id" element={<PolicyDetailsPage />} />
      <Route path="/policies/:id/edit" element={<EditPolicyPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
