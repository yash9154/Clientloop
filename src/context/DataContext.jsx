import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/client.js';

const DataContext = createContext(null);

export function DataProvider({ children }) {
    const { user, isAuthenticated, isAgency, isClient } = useAuth();

    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch clients when agency logs in
    useEffect(() => {
        if (!isAuthenticated || !isAgency) {
            setClients([]);
            return;
        }
        const fetchClients = async () => {
            try {
                const data = await api.get('/clients');
                setClients(data.clients || []);
            } catch (err) {
                console.error('Error fetching clients:', err);
            }
        };
        fetchClients();
    }, [isAuthenticated, isAgency]);

    // ── CLIENTS ──────────────────────────────────────

    const addClient = useCallback(async (clientData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await api.post('/clients', clientData);
            setClients(prev => [data.client, ...prev]);
            return data;   // return full response so caller can show portalPassword
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateClient = useCallback(async (clientId, clientData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await api.put(`/clients/${clientId}`, clientData);
            setClients(prev => prev.map(c => c._id === clientId ? data.client : c));
            return data.client;
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
            await api.delete(`/clients/${clientId}`);
            setClients(prev => prev.filter(c => c._id !== clientId));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const refreshClients = useCallback(async () => {
        try {
            const data = await api.get('/clients');
            setClients(data.clients || []);
        } catch (err) {
            console.error('Error refreshing clients:', err);
        }
    }, []);

    // ── UPDATES (fetched per client, not stored globally) ────────────

    const getUpdatesByClient = useCallback(async (clientId) => {
        try {
            const data = await api.get(`/updates/client/${clientId}`);
            return data.updates || [];
        } catch (err) {
            console.error('Error fetching updates:', err);
            return [];
        }
    }, []);

    const addUpdate = useCallback(async (updateData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await api.post('/updates', updateData);
            return data.update;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteUpdate = useCallback(async (updateId) => {
        try {
            await api.delete(`/updates/${updateId}`);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Client portal — approve or request changes
    const approveUpdate = useCallback(async (updateId) => {
        try {
            const data = await api.put(`/updates/${updateId}/approve`, {});
            return data.update;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    const requestChanges = useCallback(async (updateId, note) => {
        try {
            const data = await api.put(`/updates/${updateId}/request-changes`, { note });
            return data.update;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // Client portal — get own updates
    const getMyUpdates = useCallback(async () => {
        try {
            const data = await api.get('/updates/my-updates');
            return data.updates || [];
        } catch (err) {
            console.error('Error fetching my updates:', err);
            return [];
        }
    }, []);

    // ── NOTES (fetched per client) ────────────────────

    const getNotesByClient = useCallback(async (clientId) => {
        try {
            const data = await api.get(`/notes/client/${clientId}`);
            return data.notes || [];
        } catch (err) {
            console.error('Error fetching notes:', err);
            return [];
        }
    }, []);

    const addNote = useCallback(async (noteData) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await api.post('/notes', noteData);
            return data.note;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteNote = useCallback(async (noteId) => {
        try {
            await api.delete(`/notes/${noteId}`);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    }, []);

    // ── STATS (computed from clients) ────────────────

    const getStats = useCallback(() => {
        const now = new Date();
        const pendingFollowUps = clients.filter(c => {
            if (!c.followUpDate) return false;
            return new Date(c.followUpDate) <= now;
        }).length;

        return {
            totalClients: clients.length,
            activeClients: clients.filter(c => c.status === 'active').length,
            inactiveClients: clients.filter(c => c.status === 'inactive').length,
            leadClients: clients.filter(c => c.status === 'lead').length,
            pendingFollowUps
        };
    }, [clients]);

    const value = {
        // State
        clients,
        isLoading,
        error,
        // Client actions
        addClient,
        updateClient,
        deleteClient,
        refreshClients,
        // Update actions
        getUpdatesByClient,
        addUpdate,
        deleteUpdate,
        approveUpdate,
        requestChanges,
        getMyUpdates,
        // Note actions
        getNotesByClient,
        addNote,
        deleteNote,
        // Stats
        getStats
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within DataProvider');
    return context;
}

export default DataContext;