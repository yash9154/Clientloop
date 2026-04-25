import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/client.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const { user, isAuthenticated, isAgency } = useAuth();

    const [clients,       setClients]       = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount,   setUnreadCount]   = useState(0);
    const [isLoading,     setIsLoading]     = useState(false);
    const [error,         setError]         = useState(null);

    // Load clients + notifications on login
    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            setClients([]); setNotifications([]); setUnreadCount(0);
            return;
        }
        const init = async () => {
            try {
                const [notifData] = await Promise.all([
                    api.get('/notifications')
                ]);
                setNotifications(notifData.notifications || []);
                setUnreadCount(notifData.unreadCount || 0);

                if (isAgency) {
                    const clientData = await api.get('/clients');
                    setClients(clientData.clients || []);
                }
            } catch (err) {
                console.error('Init fetch error:', err);
            }
        };
        init();
    }, [isAuthenticated, user?.id, isAgency]);

    // ── CLIENTS ──────────────────────────────────────────────────

    const addClient = useCallback(async (data) => {
        setIsLoading(true); setError(null);
        try {
            const res = await api.post('/clients', data);
            setClients(prev => [res.client, ...prev]);
            return res;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const updateClient = useCallback(async (clientId, data) => {
        setIsLoading(true); setError(null);
        try {
            const res = await api.put(`/clients/${clientId}`, data);
            setClients(prev => prev.map(c => c._id === clientId ? res.client : c));
            return res.client;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const deleteClient = useCallback(async (clientId) => {
        setIsLoading(true); setError(null);
        try {
            await api.delete(`/clients/${clientId}`);
            setClients(prev => prev.filter(c => c._id !== clientId));
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const refreshClients = useCallback(async () => {
        try {
            const data = await api.get('/clients');
            setClients(data.clients || []);
        } catch (err) { console.error(err); }
    }, []);

    // ── PROJECTS ─────────────────────────────────────────────────

    const getProjectsByClient = useCallback(async (clientId) => {
        try {
            const data = await api.get(`/projects/client/${clientId}`);
            return data.projects || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    const getMyProjects = useCallback(async () => {
        try {
            const data = await api.get('/projects/my-projects');
            return data.projects || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    const addProject = useCallback(async (projectData) => {
        setIsLoading(true); setError(null);
        try {
            const data = await api.post('/projects', projectData);
            return data.project;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const updateProject = useCallback(async (projectId, projectData) => {
        setIsLoading(true); setError(null);
        try {
            const data = await api.put(`/projects/${projectId}`, projectData);
            return data.project;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const deleteProject = useCallback(async (projectId) => {
        setIsLoading(true); setError(null);
        try {
            await api.delete(`/projects/${projectId}`);
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    // ── UPDATES ──────────────────────────────────────────────────

    const getUpdatesByProject = useCallback(async (projectId) => {
        try {
            const data = await api.get(`/updates/project/${projectId}`);
            return data.updates || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    const getMyUpdates = useCallback(async () => {
        try {
            const data = await api.get('/updates/my-updates');
            return data.updates || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    const getUpdatesByProjectForClient = useCallback(async (projectId) => {
        try {
            const data = await api.get(`/updates/project/${projectId}/client`);
            return data.updates || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    // addUpdate supports file attachments via FormData
    const addUpdate = useCallback(async (updateData, files = []) => {
        setIsLoading(true); setError(null);
        try {
            let data;
            if (files && files.length > 0) {
                // Use FormData for file uploads
                const formData = new FormData();
                formData.append('projectId',        updateData.projectId);
                formData.append('title',            updateData.title);
                formData.append('content',          updateData.content);
                formData.append('type',             updateData.type || 'progress');
                formData.append('requiresApproval', updateData.requiresApproval ? 'true' : 'false');
                files.forEach(f => formData.append('files', f));

                // Use raw fetch for multipart
                const token = localStorage.getItem('clientloop_token');
                const res = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/updates`,
                    { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData }
                );
                data = await res.json();
                if (!res.ok) throw { message: data.message || 'Upload failed' };
            } else {
                data = await api.post('/updates', updateData);
            }
            return data.update;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const deleteUpdate = useCallback(async (updateId) => {
        try { await api.delete(`/updates/${updateId}`); }
        catch (err) { setError(err.message); throw err; }
    }, []);

    const approveUpdate = useCallback(async (updateId) => {
        try {
            const data = await api.put(`/updates/${updateId}/approve`, {});
            return data.update;
        } catch (err) { setError(err.message); throw err; }
    }, []);

    const requestChanges = useCallback(async (updateId, note) => {
        try {
            const data = await api.put(`/updates/${updateId}/request-changes`, { note });
            return data.update;
        } catch (err) { setError(err.message); throw err; }
    }, []);

    // ── COMMENTS ─────────────────────────────────────────────────

    const getCommentsByUpdate = useCallback(async (updateId) => {
        try {
            const data = await api.get(`/comments/update/${updateId}`);
            return data.comments || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    const addComment = useCallback(async (updateId, content) => {
        setIsLoading(true); setError(null);
        try {
            const data = await api.post('/comments', { updateId, content });
            return data.comment;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const deleteComment = useCallback(async (commentId) => {
        try { await api.delete(`/comments/${commentId}`); }
        catch (err) { setError(err.message); throw err; }
    }, []);

    // ── NOTES ────────────────────────────────────────────────────

    const getNotesByClient = useCallback(async (clientId) => {
        try {
            const data = await api.get(`/notes/client/${clientId}`);
            return data.notes || [];
        } catch (err) { console.error(err); return []; }
    }, []);

    const addNote = useCallback(async (noteData) => {
        setIsLoading(true); setError(null);
        try {
            const data = await api.post('/notes', noteData);
            return data.note;
        } catch (err) { setError(err.message); throw err; }
        finally { setIsLoading(false); }
    }, []);

    const deleteNote = useCallback(async (noteId) => {
        try { await api.delete(`/notes/${noteId}`); }
        catch (err) { setError(err.message); throw err; }
    }, []);

    // ── NOTIFICATIONS ─────────────────────────────────────────────

    const markNotificationRead = useCallback(async (notifId) => {
        try {
            await api.put(`/notifications/${notifId}/read`, {});
            setNotifications(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) { console.error(err); }
    }, []);

    const markAllNotificationsRead = useCallback(async () => {
        try {
            await api.put('/notifications/read-all', {});
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) { console.error(err); }
    }, []);

    const deleteNotification = useCallback(async (notifId) => {
        try {
            await api.delete(`/notifications/${notifId}`);
            setNotifications(prev => prev.filter(n => n._id !== notifId));
        } catch (err) { console.error(err); }
    }, []);

    const refreshNotifications = useCallback(async () => {
        try {
            const data = await api.get('/notifications');
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (err) { console.error(err); }
    }, []);

    // ── STATS ─────────────────────────────────────────────────────

    const getStats = useCallback(() => {
        const now = new Date();
        return {
            totalClients:     clients.length,
            activeClients:    clients.filter(c => c.status === 'active').length,
            inactiveClients:  clients.filter(c => c.status === 'inactive').length,
            leadClients:      clients.filter(c => c.status === 'lead').length,
            pendingFollowUps: clients.filter(c => c.followUpDate && new Date(c.followUpDate) <= now).length
        };
    }, [clients]);

    const value = {
        clients, notifications, unreadCount, isLoading, error,
        // Clients
        addClient, updateClient, deleteClient, refreshClients,
        // Projects
        getProjectsByClient, getMyProjects, addProject, updateProject, deleteProject,
        // Updates
        getUpdatesByProject, getMyUpdates, getUpdatesByProjectForClient,
        addUpdate, deleteUpdate, approveUpdate, requestChanges,
        // Comments
        getCommentsByUpdate, addComment, deleteComment,
        // Notes
        getNotesByClient, addNote, deleteNote,
        // Notifications
        markNotificationRead, markAllNotificationsRead,
        deleteNotification, refreshNotifications,
        // Stats
        getStats
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
}

export default DataContext;