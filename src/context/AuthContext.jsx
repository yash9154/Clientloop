import { createContext, useContext, useState, useEffect } from 'react';
import { apiSignup, apiLogin, apiGoogleLogin, apiGetMe, apiLogout } from '../api/auth.js';

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
                    // Token invalid/expired, clear it
                    localStorage.removeItem('clientloop_token');
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    /**
     * Sign up with email and password
     */
    const signup = async (email, password, name, role = 'agency', company = '') => {
        try {
            setError(null);
            setIsLoading(true);
            const data = await apiSignup(email, password, name, role, company);
            setUser(data.user);
            return data.user;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Login with email and password
     */
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

    /**
     * Login with Google
     */
    const loginWithGoogle = () => {
        return new Promise((resolve, reject) => {
            try {
                setError(null);
                setIsLoading(true);

                // Check if Google Identity Services is loaded
                if (!window.google?.accounts?.oauth2) {
                    setIsLoading(false);
                    const err = { message: 'Google Sign-In is not available. Please try again or use email login.' };
                    setError(err.message);
                    reject(err);
                    return;
                }

                // Initialize Google OAuth2 token client
                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
                    scope: 'email profile',
                    callback: async (tokenResponse) => {
                        try {
                            if (tokenResponse.error) {
                                throw { message: 'Google authentication was cancelled.' };
                            }

                            // Fetch user info from Google using the access token
                            const googleUserRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                            });
                            const googleUser = await googleUserRes.json();

                            // Send to our backend
                            const data = await apiGoogleLogin({
                                googleId: googleUser.sub,
                                email: googleUser.email,
                                name: googleUser.name,
                                avatar: googleUser.picture
                            });

                            setUser(data.user);
                            setIsLoading(false);
                            resolve({ userData: data.user, isNewUser: data.isNewUser });
                        } catch (err) {
                            setError(err.message || 'Google login failed');
                            setIsLoading(false);
                            reject(err);
                        }
                    },
                    error_callback: (err) => {
                        setError('Google login was cancelled.');
                        setIsLoading(false);
                        reject({ message: 'Google login was cancelled.' });
                    }
                });

                // Trigger the Google sign-in popup
                tokenClient.requestAccessToken();
            } catch (err) {
                setError(err.message || 'Google login failed');
                setIsLoading(false);
                reject(err);
            }
        });
    };

    /**
     * Logout
     */
    const logout = async () => {
        try {
            setError(null);
            apiLogout();
            setUser(null);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Send password reset email (placeholder)
     */
    const forgotPassword = async (email) => {
        try {
            setError(null);
            // TODO: Implement backend password reset endpoint
            console.log('Password reset requested for:', email);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    /**
     * Clear any auth errors
     */
    const clearError = () => setError(null);

    const value = {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        isAgency: user?.role === 'agency',
        isClient: user?.role === 'client',
        agencyId: user?.role === 'agency' ? user?.id : null,
        clientId: user?.role === 'client' ? user?.clientId : null,
        // Auth methods
        signup,
        login,
        loginWithGoogle,
        logout,
        forgotPassword,
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
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
