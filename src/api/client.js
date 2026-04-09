/**
 * API Client - Fetch wrapper with auth headers
 * All API calls go through this module
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔌 API Client initialized with URL:', API_URL);

/**
 * Get stored auth token
 */
const getToken = () => localStorage.getItem('clientloop_token');

/**
 * Set auth token
 */
export const setToken = (token) => {
    if (token) {
        localStorage.setItem('clientloop_token', token);
    } else {
        localStorage.removeItem('clientloop_token');
    }
};

/**
 * Core fetch wrapper - handles auth headers, JSON parsing, errors
 */
const apiClient = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    };

    // Don't set Content-Type for FormData (browser sets multipart boundary)
    if (options.body instanceof FormData) {
        delete config.headers['Content-Type'];
    }

    try {
        console.log(`📡 ${config.method || 'GET'} ${API_URL}${endpoint}`);
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...config,
            headers: config.headers
        });

        // Try to parse as JSON
        let data = {};
        try {
            data = await response.json();
        } catch {
            data = { message: response.statusText || 'Unknown error' };
        }

        if (!response.ok) {
            console.error(`❌ API Error [${response.status}]:`, data);
            throw {
                status: response.status,
                message: data.message || `HTTP ${response.status}: ${response.statusText}`,
                errors: data.errors,
                endpoint
            };
        }

        console.log(`✅ Success [${response.status}]:`, endpoint);
        return data;
    } catch (error) {
        if (error.status) {
            // Already formatted error
            throw error;
        }

        // Network error
        console.error('❌ Network Error:', error.message);
        throw {
            status: 0,
            message: `Network error: ${error.message}. Check backend is running on ${API_URL}`,
            endpoint
        };
    }
};

/**
 * HTTP method helpers
 */
export const api = {
    get: (endpoint) => apiClient(endpoint, { method: 'GET' }),

    post: (endpoint, body) => apiClient(endpoint, {
        method: 'POST',
        body: JSON.stringify(body)
    }),

    put: (endpoint, body) => apiClient(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body)
    }),

    delete: (endpoint) => apiClient(endpoint, { method: 'DELETE' }),

    /**
     * Upload file(s) via FormData
     */
    upload: (endpoint, formData) => apiClient(endpoint, {
        method: 'POST',
        body: formData // Don't JSON.stringify FormData
    })
};

export default api;
