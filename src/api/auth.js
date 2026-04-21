import { api, setToken } from './client.js';

export const apiSignup = async (email, password, name, company = '') => {
    const data = await api.post('/auth/signup', { email, password, name, company });
    setToken(data.token);
    return data;
};

export const apiLogin = async (email, password, isClientLogin = false) => {
    const data = await api.post('/auth/login', { email, password, isClientLogin });
    setToken(data.token);
    return data;
};

export const apiGetMe = async () => {
    return api.get('/auth/me');
};

export const apiUpdateProfile = async (profileData) => {
    return api.put('/auth/profile', profileData);
};

export const apiChangePassword = async (currentPassword, newPassword) => {
    return api.put('/auth/password', { currentPassword, newPassword });
};

export const apiLogout = () => {
    setToken(null);
};