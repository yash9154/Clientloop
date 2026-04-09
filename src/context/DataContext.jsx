import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
    // Client operations
    apiGetClients,
    apiCreateClient,
    apiUpdateClient as apiUpdateClientFn,
    apiDeleteClient as apiDeleteClientFn,
    // Project operations
    apiGetProjects,
    apiCreateProject,
    apiUpdateProject as apiUpdateProjectFn,
    apiDeleteProject as apiDeleteProjectFn,
    apiGetProjectsByClient as apiGetProjectsByClientFn,
    // Update operations
    apiGetUpdates,
    apiGetUpdatesByProject as apiGetUpdatesByProjectFn,
    apiCreateUpdate,
    apiApproveUpdate as apiApproveUpdateFn,
    apiRequestChanges as apiRequestChangesFn,
    // Comment operations
    apiCreateComment,
    apiGetCommentsByUpdate as apiGetCommentsByUpdateFn,
    // Notification operations
    apiGetNotifications,
    apiMarkNotificationRead as apiMarkNotificationReadFn,
    apiMarkAllNotificationsRead as apiMarkAllNotificationsReadFn,
    // Stats
    apiGetDashboardStats,
    // File operations
    apiUploadFile,
    apiUploadFiles,
    // Utilities
    formatFileSize,
    getFileType,
    validateFile
} from '../api/data.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const { user, isAuthenticated, isAgency } = useAuth();

    // State
    const [clients, setClients] = useState([]);
    const [projects, setProjects] = useState([]);
    const [updates, setUpdates] = useState([]);
    const [comments, setComments] = useState([]);
    const [files, setFiles] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [subscription, setSubscription] = useState({
        plan: 'free',
        status: 'active',
        clientLimit: 1,
        currentClients: 0,
        billingCycle: 'monthly',
        amount: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch initial data when authenticated
    useEffect(() => {
        if (!isAuthenticated || !user?.id) {
            setClients([]);
            setProjects([]);
            setNotifications([]);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch notifications for all users
                const notifData = await apiGetNotifications();
                setNotifications(notifData.notifications || []);

                if (isAgency) {
                    // Fetch clients and projects for agency users
                    const [clientData, projectData, updateData] = await Promise.all([
                        apiGetClients(),
                        apiGetProjects(),
                        apiGetUpdates()
                    ]);
                    setClients(clientData.clients || []);
                    setProjects(projectData.projects || []);
                    setUpdates(updateData.updates || []);

                    // Set subscription from user data
                    if (user.subscription) {
                        setSubscription({
                            plan: user.subscription.plan || 'free',
                            status: user.subscription.status || 'active',
                            clientLimit: user.subscription.clientLimit || 1,
                            currentClients: (clientData.clients || []).length,
                            billingCycle: 'monthly',
                            amount: user.subscription.plan === 'starter' ? 19 : user.subscription.plan === 'agency' ? 49 : 0
                        });
                    }
                } else {
                    // Fetch projects for client users
                    const [projectData, updateData] = await Promise.all([
                        apiGetProjects(),
                        apiGetUpdates()
                    ]);
                    setProjects(projectData.projects || []);
                    setUpdates(updateData.updates || []);
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
            }
        };

        fetchData();
    }, [isAuthenticated, user?.id, isAgency]);

    // ============================================
    // CLIENT FUNCTIONS
    // ============================================

    const addClient = useCallback(async (clientData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiCreateClient(clientData);
            const newClient = data.client;
            setClients(prev => [newClient, ...prev]);
            return newClient;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateClient = useCallback(async (clientId, data) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await apiUpdateClientFn(clientId, data);
            setClients(prev => prev.map(c => c._id === clientId ? result.client : c));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteClient = useCallback(async (clientId) => {
        try {
            setIsLoading(true);
            setError(null);
            await apiDeleteClientFn(clientId);
            setClients(prev => prev.filter(c => c._id !== clientId));
            setProjects(prev => prev.filter(p => p.clientId !== clientId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getClient = useCallback((clientId) => {
        return clients.find(c => (c._id === clientId || c.id === clientId)) || null;
    }, [clients]);

    // ============================================
    // PROJECT FUNCTIONS
    // ============================================

    const addProject = useCallback(async (projectData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiCreateProject(projectData);
            const newProject = data.project;
            setProjects(prev => [newProject, ...prev]);
            return newProject;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateProject = useCallback(async (projectId, data) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await apiUpdateProjectFn(projectId, data);
            setProjects(prev => prev.map(p => p._id === projectId ? result.project : p));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteProject = useCallback(async (projectId) => {
        try {
            setIsLoading(true);
            setError(null);
            await apiDeleteProjectFn(projectId);
            setProjects(prev => prev.filter(p => p._id !== projectId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getProject = useCallback((projectId) => {
        return projects.find(p => (p._id === projectId || p.id === projectId)) || null;
    }, [projects]);

    const getProjectsByClient = useCallback((clientId) => {
        return projects.filter(p => p.clientId === clientId || p.clientId?._id === clientId);
    }, [projects]);

    // ============================================
    // UPDATE FUNCTIONS
    // ============================================

    const addUpdate = useCallback(async (updateData) => {
        try {
            setIsLoading(true);
            setError(null);

            // Handle file uploads if any
            let uploadedFiles = [];
            if (updateData.files && updateData.files.length > 0) {
                try {
                    const folder = `clientloop/projects/${updateData.projectId}`;
                    const result = await apiUploadFiles(updateData.files, folder);
                    uploadedFiles = result.files || [];
                } catch (uploadError) {
                    console.warn('File upload skipped:', uploadError.message);
                    uploadedFiles = [];
                }
            }

            const data = await apiCreateUpdate({
                title: updateData.title,
                content: updateData.content,
                type: updateData.type || 'progress',
                projectId: updateData.projectId,
                requiresApproval: updateData.requiresApproval || false,
                files: uploadedFiles
            });

            return data.update;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getUpdatesByProject = useCallback(async (projectId) => {
        try {
            const data = await apiGetUpdatesByProjectFn(projectId);
            const fetched = data.updates || [];
            setUpdates(fetched);
            return fetched;
        } catch (err) {
            console.error('Error fetching updates:', err);
            return [];
        }
    }, []);

    const approveUpdate = useCallback(async (updateId) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiApproveUpdateFn(updateId);

            // Update local state
            setUpdates(prev => prev.map(u =>
                u._id === updateId ? data.update : u
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const requestChanges = useCallback(async (updateId, requesterName, note) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiRequestChangesFn(updateId, note);

            // Update local state
            setUpdates(prev => prev.map(u =>
                u._id === updateId ? data.update : u
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ============================================
    // COMMENT FUNCTIONS
    // ============================================

    const addComment = useCallback(async (commentData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await apiCreateComment({
                content: commentData.content,
                updateId: commentData.updateId
            });
            return data.comment;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getCommentsByUpdate = useCallback(async (updateId) => {
        try {
            const data = await apiGetCommentsByUpdateFn(updateId);
            return data.comments || [];
        } catch (err) {
            console.error('Error fetching comments:', err);
            return [];
        }
    }, []);

    // ============================================
    // FILE FUNCTIONS
    // ============================================

    const addFile = useCallback(async (file, projectId) => {
        try {
            setIsLoading(true);
            setError(null);

            const folder = `clientloop/projects/${projectId}`;
            const data = await apiUploadFile(file, folder);
            return {
                ...data.file,
                projectId,
                uploadedBy: user?.name
            };
        } catch (err) {
            const errorMessage = err.message || 'Error uploading file';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, [user?.name]);

    const getFilesByProject = useCallback((projectId) => {
        return files.filter(f => f.projectId === projectId);
    }, [files]);

    // ============================================
    // NOTIFICATION FUNCTIONS
    // ============================================

    const markNotificationRead = useCallback(async (notificationId) => {
        try {
            await apiMarkNotificationReadFn(notificationId);
            setNotifications(prev => prev.map(n =>
                n._id === notificationId ? { ...n, read: true } : n
            ));
        } catch (err) {
            console.error('Error marking notification read:', err);
        }
    }, []);

    const markAllNotificationsRead = useCallback(async () => {
        try {
            await apiMarkAllNotificationsReadFn();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Error marking all notifications read:', err);
        }
    }, []);

    const getUnreadCount = useCallback(() => {
        return notifications.filter(n => !n.read).length;
    }, [notifications]);

    // ============================================
    // STATS FUNCTIONS
    // ============================================

    const getStats = useCallback(() => {
        return {
            totalClients: clients.length,
            totalProjects: projects.length,
            pendingApprovals: updates.filter(u => u.approvalStatus === 'pending').length,
            completedProjects: projects.filter(p => p.status === 'completed').length
        };
    }, [clients, projects, updates]);

    const fetchStats = useCallback(async () => {
        if (!user?.id || !isAgency) return getStats();
        try {
            const data = await apiGetDashboardStats();
            return data.stats;
        } catch (err) {
            console.error('Error fetching stats:', err);
            return getStats();
        }
    }, [user?.id, isAgency, getStats]);

    // ============================================
    // CONTEXT VALUE
    // ============================================

    const value = {
        // State
        clients,
        projects,
        updates,
        comments,
        files,
        notifications,
        subscription,
        isLoading,
        error,
        // Client functions
        addClient,
        updateClient,
        deleteClient,
        getClient,
        // Project functions
        addProject,
        updateProject,
        deleteProject,
        getProject,
        getProjectsByClient,
        // Update functions
        addUpdate,
        getUpdatesByProject,
        approveUpdate,
        requestChanges,
        // Comment functions
        addComment,
        getCommentsByUpdate,
        // File functions
        addFile,
        getFilesByProject,
        // Notification functions
        markNotificationRead,
        markAllNotificationsRead,
        getUnreadCount,
        // Stats
        getStats,
        fetchStats
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

export default DataContext;
