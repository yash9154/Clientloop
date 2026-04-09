import api from './client.js';

// ============================================
// CLIENT OPERATIONS
// ============================================

export const apiGetClients = () => api.get('/clients');
export const apiGetClient = (id) => api.get(`/clients/${id}`);
export const apiCreateClient = (data) => api.post('/clients', data);
export const apiUpdateClient = (id, data) => api.put(`/clients/${id}`, data);
export const apiDeleteClient = (id) => api.delete(`/clients/${id}`);

// ============================================
// PROJECT OPERATIONS
// ============================================

export const apiGetProjects = () => api.get('/projects');
export const apiGetProject = (id) => api.get(`/projects/${id}`);
export const apiGetProjectsByClient = (clientId) => api.get(`/projects/client/${clientId}`);
export const apiCreateProject = (data) => api.post('/projects', data);
export const apiUpdateProject = (id, data) => api.put(`/projects/${id}`, data);
export const apiDeleteProject = (id) => api.delete(`/projects/${id}`);

// ============================================
// UPDATE OPERATIONS
// ============================================

export const apiGetUpdates = () => api.get('/updates');
export const apiGetUpdatesByProject = (projectId) => api.get(`/updates/project/${projectId}`);
export const apiCreateUpdate = (data) => api.post('/updates', data);
export const apiApproveUpdate = (id) => api.post(`/updates/${id}/approve`);
export const apiRequestChanges = (id, note) => api.post(`/updates/${id}/request-changes`, { note });

// ============================================
// COMMENT OPERATIONS
// ============================================

export const apiGetCommentsByUpdate = (updateId) => api.get(`/comments/update/${updateId}`);
export const apiCreateComment = (data) => api.post('/comments', data);

// ============================================
// NOTIFICATION OPERATIONS
// ============================================

export const apiGetNotifications = () => api.get('/notifications');
export const apiMarkNotificationRead = (id) => api.put(`/notifications/${id}/read`);
export const apiMarkAllNotificationsRead = () => api.put('/notifications/read-all');

// ============================================
// STATS
// ============================================

export const apiGetDashboardStats = () => api.get('/stats/dashboard');

// ============================================
// FILE UPLOAD
// ============================================

export const apiUploadFile = async (file, folder = 'clientloop/files') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    return api.upload('/upload', formData);
};

export const apiUploadFiles = async (files, folder = 'clientloop/files') => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('folder', folder);
    return api.upload('/upload/multiple', formData);
};

export const apiDeleteFile = (publicId) => api.delete(`/upload/${publicId}`);

// ============================================
// UTILITY FUNCTIONS (kept client-side)
// ============================================

export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        pdf: 'pdf', doc: 'document', docx: 'document', txt: 'document', rtf: 'document',
        xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
        jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
        psd: 'design', ai: 'design', sketch: 'design', fig: 'design', xd: 'design',
        zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive',
        mp4: 'video', mov: 'video', avi: 'video', webm: 'video',
        mp3: 'audio', wav: 'audio', m4a: 'audio'
    };
    return types[ext] || 'file';
};

export const validateFile = (file, options = {}) => {
    const {
        maxSize = 50 * 1024 * 1024,
        allowedTypes = null
    } = options;

    const errors = [];
    if (file.size > maxSize) {
        errors.push(`File size exceeds ${formatFileSize(maxSize)} limit`);
    }
    if (allowedTypes) {
        const fileType = getFileType(file.name);
        if (!allowedTypes.includes(fileType)) {
            errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`);
        }
    }
    return { valid: errors.length === 0, errors };
};
