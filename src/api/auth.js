import { api, setToken } from './client.js';

/**
 * Sign up with email and password
 */
export const apiSignup = async (email, password, name, role = 'agency', company = '') => {
    const data = await api.post('/auth/signup', { email, password, name, role, company });
    setToken(data.token);
    return data;
};

/**
 * Login with email and password
 */
export const apiLogin = async (email, password, isClientLogin = false) => {
    const data = await api.post('/auth/login', { email, password, isClientLogin });
    setToken(data.token);
    return data;
};

/**
 * Google OAuth login
 */
export const apiGoogleLogin = async (googleData) => {
    const data = await api.post('/auth/google', googleData);
    setToken(data.token);
    return data;
};

/**
 * Get current authenticated user
 */
export const apiGetMe = async () => {
    return api.get('/auth/me');
};

/**
 * Update user profile
 */
export const apiUpdateProfile = async (profileData) => {
    return api.put('/auth/profile', profileData);
};

/**
 * Change password
 */
export const apiChangePassword = async (currentPassword, newPassword) => {
    return api.put('/auth/password', { currentPassword, newPassword });
};

/**
 * Logout - clear token
 */
export const apiLogout = () => {
    setToken(null);
};
