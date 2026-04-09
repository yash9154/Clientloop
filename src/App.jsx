import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './index.css';
import './components.css';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ClientLoginPage from './pages/auth/ClientLoginPage';

// Agency Pages
import AgencyLayout from './layouts/AgencyLayout';
import Dashboard from './pages/agency/Dashboard';
import ClientsPage from './pages/agency/ClientsPage';
import ClientDetailPage from './pages/agency/ClientDetailPage';
import ProjectsPage from './pages/agency/ProjectsPage';
import ProjectDetailPage from './pages/agency/ProjectDetailPage';
import BillingPage from './pages/agency/BillingPage';
import SettingsPage from './pages/agency/SettingsPage';

// Client Pages
import ClientLayout from './layouts/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjectView from './pages/client/ClientProjectView';

// Landing Page
import LandingPage from './pages/LandingPage';

/**
 * Protected Route Component - Checks authentication and role
 */
function ProtectedRoute({ children, allowedRole }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                background: '#f5f5f5'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #e0e0e0',
                    borderTop: '4px solid #4338ca',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the required role
    if (allowedRole && user.role !== allowedRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}

/**
 * App Routes Component - Defines all routes
 */
function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/client-login" element={<ClientLoginPage />} />

            {/* Agency Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><Dashboard /></AgencyLayout>
                </ProtectedRoute>
            } />
            <Route path="/clients" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><ClientsPage /></AgencyLayout>
                </ProtectedRoute>
            } />
            <Route path="/clients/:clientId" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><ClientDetailPage /></AgencyLayout>
                </ProtectedRoute>
            } />
            <Route path="/projects" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><ProjectsPage /></AgencyLayout>
                </ProtectedRoute>
            } />
            <Route path="/projects/:projectId" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><ProjectDetailPage /></AgencyLayout>
                </ProtectedRoute>
            } />
            <Route path="/billing" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><BillingPage /></AgencyLayout>
                </ProtectedRoute>
            } />
            <Route path="/settings" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><SettingsPage /></AgencyLayout>
                </ProtectedRoute>
            } />

            {/* Client Routes */}
            <Route path="/client" element={
                <ProtectedRoute allowedRole="client">
                    <ClientLayout><ClientDashboard /></ClientLayout>
                </ProtectedRoute>
            } />
            <Route path="/client/project/:projectId" element={
                <ProtectedRoute allowedRole="client">
                    <ClientLayout><ClientProjectView /></ClientLayout>
                </ProtectedRoute>
            } />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

/**
 * Main App Component
 */
function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <AppRoutes />
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
