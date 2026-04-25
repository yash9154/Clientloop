import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './index.css';
import './components.css';

// Auth
import LoginPage          from './pages/auth/LoginPage';
import SignupPage         from './pages/auth/SignupPage';
import ClientLoginPage    from './pages/auth/ClientLoginPage';

// Agency
import AgencyLayout       from './layouts/AgencyLayout';
import Dashboard          from './pages/agency/Dashboard';
import ClientsPage        from './pages/agency/ClientsPage';
import ClientDetailPage   from './pages/agency/ClientDetailPage';
import ProjectsPage       from './pages/agency/ProjectsPage';
import ProjectDetailPage  from './pages/agency/ProjectDetailPage';
import NotificationsPage  from './pages/agency/NotificationsPage';
import FollowUpsPage      from './pages/agency/FollowUpsPage';
import SettingsPage       from './pages/agency/SettingsPage';

// Client
import ClientLayout       from './layouts/ClientLayout';
import ClientDashboard    from './pages/client/ClientDashboard';
import ClientSettingsPage from './pages/client/ClientSettingsPage';

// Landing
import LandingPage from './pages/LandingPage';

function ProtectedRoute({ children, allowedRole }) {
    const { user, isLoading } = useAuth();

    if (isLoading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
            <div style={{
                width: '40px', height: '40px',
                border: '4px solid #e0e0e0', borderTop: '4px solid #4338ca',
                borderRadius: '50%', animation: 'spin 1s linear infinite'
            }} />
        </div>
    );

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRole && user.role !== allowedRole)
        return <Navigate to={user.role === 'client' ? '/client' : '/dashboard'} replace />;

    return children;
}

function Agency({ page }) {
    return (
        <ProtectedRoute allowedRole="agency">
            <AgencyLayout>{page}</AgencyLayout>
        </ProtectedRoute>
    );
}

function Client({ page }) {
    return (
        <ProtectedRoute allowedRole="client">
            <ClientLayout>{page}</ClientLayout>
        </ProtectedRoute>
    );
}

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            {/* Public */}
            <Route path="/"             element={<LandingPage />} />
            <Route path="/login"        element={<LoginPage />} />
            <Route path="/signup"       element={<SignupPage />} />
            <Route path="/client-login" element={<ClientLoginPage />} />

            {/* Agency */}
            <Route path="/dashboard"           element={<Agency page={<Dashboard />} />} />
            <Route path="/clients"             element={<Agency page={<ClientsPage />} />} />
            <Route path="/clients/:clientId"   element={<Agency page={<ClientDetailPage />} />} />
            <Route path="/projects"            element={<Agency page={<ProjectsPage />} />} />
            <Route path="/projects/:projectId" element={<Agency page={<ProjectDetailPage />} />} />
            <Route path="/notifications"       element={<Agency page={<NotificationsPage />} />} />
            <Route path="/follow-ups"          element={<Agency page={<FollowUpsPage />} />} />
            <Route path="/settings"            element={<Agency page={<SettingsPage />} />} />

            {/* Client */}
            <Route path="/client"          element={<Client page={<ClientDashboard />} />} />
            <Route path="/client/settings" element={<Client page={<ClientSettingsPage />} />} />

            {/* Catch all */}
            <Route path="*" element={
                <Navigate to={user ? (user.role === 'client' ? '/client' : '/dashboard') : '/'} replace />
            } />
        </Routes>
    );
}

export default function App() {
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