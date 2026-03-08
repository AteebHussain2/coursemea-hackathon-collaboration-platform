import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Pages
import Login from './pages/auth/Login.tsx';
import Register from './pages/auth/Register.tsx';
import WorkspaceList from './pages/workspaces/WorkspaceList.tsx';
import CreateWorkspace from './pages/workspaces/CreateWorkspace.tsx';
import WorkspaceDetails from './pages/workspaces/WorkspaceDetails.tsx';

// Protected Route Wrapper
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/workspaces"
        element={
          <ProtectedRoute>
            <WorkspaceList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/create"
        element={
          <ProtectedRoute>
            <CreateWorkspace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/workspaces/:id"
        element={
          <ProtectedRoute>
            <WorkspaceDetails />
          </ProtectedRoute>
        }
      />

      {/* Default redirect to workspaces */}
      <Route path="*" element={<Navigate to="/workspaces" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
