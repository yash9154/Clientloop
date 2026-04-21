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
import SettingsPage from './pages/agency/SettingsPage';

// Client Pages
import ClientLayout from './layouts/ClientLayout';
import ClientDashboard from './pages/client/ClientDashboard';

// Landing Page
import LandingPage from './pages/LandingPage';

function ProtectedRoute({ children, allowedRole }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div style={{
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', minHeight: '100vh'
            }}>
                <div style={{
                    width: '40px', height: '40px',
                    border: '4px solid #e0e0e0',
                    borderTop: '4px solid #4338ca',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRole && user.role !== allowedRole) {
        // Send clients to client portal, agencies to dashboard
        return <Navigate to={user.role === 'client' ? '/client' : '/dashboard'} replace />;
    }

    return children;
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/client-login" element={<ClientLoginPage />} />

            {/* Agency */}
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
            <Route path="/settings" element={
                <ProtectedRoute allowedRole="agency">
                    <AgencyLayout><SettingsPage /></AgencyLayout>
                </ProtectedRoute>
            } />

            {/* Client Portal */}
            <Route path="/client" element={
                <ProtectedRoute allowedRole="client">
                    <ClientLayout><ClientDashboard /></ClientLayout>
                </ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={
                <Navigate to={user ? (user.role === 'client' ? '/client' : '/dashboard') : '/'} replace />
            } />
        </Routes>
    );
}

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