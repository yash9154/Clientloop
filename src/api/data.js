import api from './client.js';

// ── CLIENTS ──────────────────────────────────────────────────────
export const apiGetClients      = ()         => api.get('/clients');
export const apiGetClient       = (id)       => api.get(`/clients/${id}`);
export const apiCreateClient    = (data)     => api.post('/clients', data);
export const apiUpdateClient    = (id, data) => api.put(`/clients/${id}`, data);
export const apiDeleteClient    = (id)       => api.delete(`/clients/${id}`);

// ── PROJECTS ─────────────────────────────────────────────────────
export const apiGetProjectsByClient   = (clientId)   => api.get(`/projects/client/${clientId}`);
export const apiGetProject            = (id)          => api.get(`/projects/${id}`);
export const apiGetMyProjects         = ()            => api.get('/projects/my-projects');
export const apiCreateProject         = (data)        => api.post('/projects', data);
export const apiUpdateProject         = (id, data)    => api.put(`/projects/${id}`, data);
export const apiDeleteProject         = (id)          => api.delete(`/projects/${id}`);

// ── UPDATES ──────────────────────────────────────────────────────
export const apiGetUpdatesByProject         = (projectId) => api.get(`/updates/project/${projectId}`);
export const apiGetUpdatesByProjectClient   = (projectId) => api.get(`/updates/project/${projectId}/client`);
export const apiGetMyUpdates                = ()           => api.get('/updates/my-updates');
export const apiDeleteUpdate                = (id)         => api.delete(`/updates/${id}`);
export const apiApproveUpdate               = (id)         => api.put(`/updates/${id}/approve`, {});
export const apiRequestChanges              = (id, note)   => api.put(`/updates/${id}/request-changes`, { note });

// ── COMMENTS ─────────────────────────────────────────────────────
export const apiGetCommentsByUpdate = (updateId)        => api.get(`/comments/update/${updateId}`);
export const apiCreateComment       = (updateId, content) => api.post('/comments', { updateId, content });
export const apiDeleteComment       = (id)              => api.delete(`/comments/${id}`);

// ── NOTES ────────────────────────────────────────────────────────
export const apiGetNotesByClient = (clientId)  => api.get(`/notes/client/${clientId}`);
export const apiCreateNote       = (data)      => api.post('/notes', data);
export const apiDeleteNote       = (id)        => api.delete(`/notes/${id}`);

// ── NOTIFICATIONS ─────────────────────────────────────────────────
export const apiGetNotifications        = ()   => api.get('/notifications');
export const apiMarkNotificationRead    = (id) => api.put(`/notifications/${id}/read`, {});
export const apiMarkAllNotificationsRead = ()  => api.put('/notifications/read-all', {});
export const apiDeleteNotification      = (id) => api.delete(`/notifications/${id}`);

// ── UTILITIES ─────────────────────────────────────────────────────
export const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        pdf: 'pdf',
        doc: 'document', docx: 'document',
        xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
        ppt: 'document', pptx: 'document',
        jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
        mp4: 'video', mov: 'video', avi: 'video', webm: 'video',
        zip: 'file', rar: 'file', txt: 'file'
    };
    return types[ext] || 'file';
};