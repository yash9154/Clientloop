import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import api from '../../api/client.js';
import {
    Plus, Search, FolderOpen, Clock,
    CheckCircle2, AlertCircle, Users, X
} from 'lucide-react';

// ── CREATE PROJECT MODAL ──────────────────────────────────────────

function CreateProjectModal({ isOpen, onClose, clients, onCreated }) {
    const { addProject } = useData();
    const [form,   setForm]   = useState({ name: '', description: '', clientId: '' });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState('');

    if (!isOpen) return null;
    const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const project = await addProject(form);
            onCreated(project);
            setForm({ name: '', description: '', clientId: '' });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create project');
        } finally { setSaving(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Project</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {error && (
                            <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-50)', border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)' }}>
                                {error}
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label required">Client</label>
                            <select className="form-input form-select" value={form.clientId} onChange={set('clientId')} required>
                                <option value="">Select a client...</option>
                                {clients.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Project Name</label>
                            <input className="form-input" placeholder="e.g. Website Redesign" value={form.name} onChange={set('name')} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input form-textarea" placeholder="Brief description..." value={form.description} onChange={set('description')} rows={3} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Creating...' : <><Plus size={16} /> Create Project</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────

export default function ProjectsPage() {
    const { clients } = useData();
    const [projects,     setProjects]     = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [searchQuery,  setSearchQuery]  = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showCreate,   setShowCreate]   = useState(false);

    // Fetch all projects across all clients
    const fetchAllProjects = async () => {
        if (clients.length === 0) { setLoading(false); return; }
        setLoading(true);
        try {
            const results = await Promise.all(
                clients.map(c =>
                    api.get(`/projects/client/${c._id}`)
                        .then(d => (d.projects || []))
                        .catch(() => [])
                )
            );
            const all = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setProjects(all);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAllProjects(); }, [clients]);

    const statusConfig = {
        'in-progress': { label: 'In Progress', bg: 'var(--color-info-100)',    text: 'var(--color-info-700)',    icon: Clock        },
        'review':      { label: 'In Review',   bg: 'var(--color-warning-100)', text: 'var(--color-warning-700)', icon: AlertCircle  },
        'completed':   { label: 'Completed',   bg: 'var(--color-success-100)', text: 'var(--color-success-700)', icon: CheckCircle2 },
    };

    const filtered = projects.filter(p => {
        const matchSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = statusFilter === 'all' || p.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const counts = {
        all:           projects.length,
        'in-progress': projects.filter(p => p.status === 'in-progress').length,
        'review':      projects.filter(p => p.status === 'review').length,
        'completed':   projects.filter(p => p.status === 'completed').length,
    };

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return (
        <div>
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} across {clients.length} client{clients.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowCreate(true)} disabled={clients.length === 0}>
                    <Plus size={18} /> New Project
                </button>
            </div>

            {clients.length === 0 ? (
                <div className="empty-state">
                    <Users className="empty-state-icon" />
                    <h3 className="empty-state-title">No clients yet</h3>
                    <p className="empty-state-description">Add a client first before creating projects.</p>
                    <Link to="/clients" className="btn btn-primary"><Plus size={18} /> Add Client</Link>
                </div>
            ) : (
                <>
                    {/* Stats */}
                    <div className="grid grid-cols-4 md:grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                        {[
                            { label: 'Total',       value: counts.all,           color: 'var(--color-primary-600)', bg: 'var(--color-primary-100)' },
                            { label: 'In Progress', value: counts['in-progress'], color: 'var(--color-info-600)',    bg: 'var(--color-info-100)'    },
                            { label: 'In Review',   value: counts['review'],      color: 'var(--color-warning-600)', bg: 'var(--color-warning-100)' },
                            { label: 'Completed',   value: counts['completed'],   color: 'var(--color-success-600)', bg: 'var(--color-success-100)' },
                        ].map(s => (
                            <div key={s.label} className="stat-card animate-fade-in-up">
                                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                                    <FolderOpen size={20} />
                                </div>
                                <div className="stat-content">
                                    <div className="stat-label">{s.label}</div>
                                    <div className="stat-value">{s.value}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Search + Filter */}
                    <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap', alignItems: 'center' }}>
                        <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
                            <Search size={18} className="search-input-icon" />
                            <input
                                type="text" className="form-input"
                                placeholder="Search projects or clients..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {[
                                { key: 'all',         label: `All (${counts.all})`                    },
                                { key: 'in-progress', label: `In Progress (${counts['in-progress']})` },
                                { key: 'review',      label: `In Review (${counts['review']})`         },
                                { key: 'completed',   label: `Completed (${counts['completed']})`      },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    className={`btn btn-sm ${statusFilter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setStatusFilter(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Projects list */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-tertiary)' }}>
                            <Clock size={32} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
                            <p>Loading projects...</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="empty-state">
                            <FolderOpen className="empty-state-icon" />
                            <h3 className="empty-state-title">
                                {searchQuery || statusFilter !== 'all' ? 'No projects match your filters' : 'No projects yet'}
                            </h3>
                            <p className="empty-state-description">
                                {searchQuery || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter'
                                    : 'Create your first project to get started'}
                            </p>
                            {!searchQuery && statusFilter === 'all' && (
                                <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
                                    <Plus size={18} /> Create First Project
                                </button>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            {filtered.map((project, i) => {
                                const sc = statusConfig[project.status] || statusConfig['in-progress'];
                                const StatusIcon = sc.icon;
                                return (
                                    <div key={project._id} className="card card-hover animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s` }}>
                                        <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                            {/* Folder icon */}
                                            <div style={{
                                                width: '44px', height: '44px', flexShrink: 0,
                                                background: 'var(--color-primary-100)', borderRadius: 'var(--radius-lg)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'var(--color-primary-600)'
                                            }}>
                                                <FolderOpen size={20} />
                                            </div>

                                            {/* Project info */}
                                            <div style={{ flex: 1, minWidth: '180px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: '4px' }}>
                                                    <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>
                                                        {project.name}
                                                    </span>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                                        fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                                        padding: '2px 10px', borderRadius: 'var(--radius-full)',
                                                        background: sc.bg, color: sc.text
                                                    }}>
                                                        <StatusIcon size={11} /> {sc.label}
                                                    </span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                                        <Users size={12} /> {project.clientName || 'Unknown client'}
                                                    </span>
                                                    {project.description && (
                                                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                                            {project.description.slice(0, 60)}{project.description.length > 60 ? '...' : ''}
                                                        </span>
                                                    )}
                                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                                        Created {formatDate(project.createdAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexShrink: 0 }}>
                                                <Link
                                                    to={`/clients/${project.clientId}`}
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ color: 'var(--text-tertiary)' }}
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    <Users size={14} /> Client
                                                </Link>
                                                <Link to={`/projects/${project._id}`} className="btn btn-primary btn-sm">
                                                    Open →
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}

            <CreateProjectModal
                isOpen={showCreate}
                onClose={() => setShowCreate(false)}
                clients={clients}
                onCreated={p => {
                    setProjects(prev => [p, ...prev]);
                    setShowCreate(false);
                }}
            />
        </div>
    );
}