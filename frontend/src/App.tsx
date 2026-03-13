import { type ReactNode, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

// Pages - Lazy Loaded
const Login = lazy(() => import('./pages/auth/Login.tsx'));
const Register = lazy(() => import('./pages/auth/Register.tsx'));
const WorkspaceList = lazy(() => import('./pages/workspaces/WorkspaceList.tsx'));
const CreateWorkspace = lazy(() => import('./pages/workspaces/CreateWorkspace.tsx'));
const WorkspaceDetails = lazy(() => import('./pages/workspaces/WorkspaceDetails.tsx'));
const Dashboard = lazy(() => import('./pages/workspaces/Dashboard.tsx'));
const ProjectDetails = lazy(() => import('./pages/projects/ProjectDetails.tsx'));
const JoinWorkspace = lazy(() => import('./pages/workspaces/JoinWorkspace.tsx'));

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
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    }>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/join/:token" element={<JoinWorkspace />} />

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
        <Route
          path="/workspaces/:id/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/workspaces/:id/projects/:projectId"
          element={
            <ProtectedRoute>
              <ProjectDetails />
            </ProtectedRoute>
          }
        />

        {/* Default redirect to workspaces */}
        <Route path="*" element={<Navigate to="/workspaces" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
          <Toaster position="top-right" />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
