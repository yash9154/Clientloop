import { createContext, useContext, useState, useEffect } from 'react';
import { apiSignup, apiLogin, apiGetMe, apiLogout } from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('clientloop_token');
            if (token) {
                try {
                    const data = await apiGetMe();
                    setUser(data.user);
                } catch {
                    localStorage.removeItem('clientloop_token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, []);

    const signup = async (email, password, name, company = '') => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await apiSignup(email, password, name, company);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password, isClientLogin = false) => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await apiLogin(email, password, isClientLogin);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const clearError = () => setError(null);

    const value = {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        isAgency: user?.role === 'agency',
        isClient: user?.role === 'client',
        signup,
        login,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}

export default AuthContext;