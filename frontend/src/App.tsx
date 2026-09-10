import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UISettingsProvider } from './context/UIContext';
import { MainLayout } from './components/MainLayout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Vault } from './pages/Vault';
import { AuditViewer } from './pages/AuditViewer';
import { AdminPanel } from './pages/AdminPanel';
import { AccessLogs } from './pages/AccessLogs';
import { DocVerification } from './pages/DocVerification';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" />;
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <UISettingsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="vault" element={<Vault />} />
              <Route path="audit" element={<AuditViewer />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="access-logs" element={<AccessLogs />} />
              <Route path="doc-verification" element={<DocVerification />} />
            </Route>
          </Routes>
        </Router>
      </UISettingsProvider>
    </AuthProvider>
  );
}

export default App;
