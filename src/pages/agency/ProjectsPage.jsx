import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    Plus,
    Search,
    Filter,
    FolderOpen,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    Calendar
} from 'lucide-react';

function CreateProjectModal({ isOpen, onClose, onSubmit, clients }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [clientId, setClientId] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, description, clientId });
        setName('');
        setDescription('');
        setClientId('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Create New Project</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label required">Client</label>
                            <select
                                className="form-input form-select"
                                value={clientId}
                                onChange={(e) => setClientId(e.target.value)}
                                required
                            >
                                <option value="">Select a client</option>
                                {clients.map(client => (
                                    <option key={client._id || client.id} value={client._id || client.id}>{client.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label required">Project Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Website Redesign"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Brief description of the project..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        'not-started': { label: 'Not Started', class: 'badge-not-started' },
        'in-progress': { label: 'In Progress', class: 'badge-in-progress' },
        'waiting-approval': { label: 'Waiting for Approval', class: 'badge-waiting' },
        'completed': { label: 'Completed', class: 'badge-completed' }
    };

    const { label, class: className } = config[status] || config['not-started'];

    return <span className={`badge ${className}`}>{label}</span>;
}

function ProjectRow({ project, client }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';
    };

    return (
        <Link
            to={`/projects/${project._id || project.id}`}
            className="transition-colors"
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 180px 180px 120px',
                alignItems: 'center',
                gap: 'var(--space-4)',
                padding: 'var(--space-4) var(--space-6)',
                borderBottom: '1px solid var(--border-light)'
            }}
        >
            <div>
                <div style={{
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--text-primary)',
                    marginBottom: 'var(--space-1)'
                }}>
                    {project.name}
                </div>
                <div style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)'
                }}>
                    {project.description?.slice(0, 60)}{project.description?.length > 60 ? '...' : ''}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div
                    className="avatar avatar-sm"
                    style={{
                        background: `hsl(${client?.name?.charCodeAt(0) * 10 % 360}, 60%, 50%)`,
                        color: 'white'
                    }}
                >
                    {getInitials(client?.name)}
                </div>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                    {client?.name || 'Unknown'}
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                <Calendar size={14} />
                {formatDate(project.updatedAt)}
            </div>
            <div>
                <StatusBadge status={project.status} />
            </div>
        </Link>
    );
}

function ProjectCard({ project, client }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <Link to={`/projects/${project._id || project.id}`} className="card card-hover animate-fade-in-up" style={{ display: 'block' }}>
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <div>
                        <div style={{
                            fontSize: 'var(--font-size-xs)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-1)'
                        }}>
                            {client?.name}
                        </div>
                        <h3 style={{
                            fontSize: 'var(--font-size-base)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--text-primary)'
                        }}>
                            {project.name}
                        </h3>
                    </div>
                    <StatusBadge status={project.status} />
                </div>
                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)',
                    marginBottom: 'var(--space-4)',
                    lineHeight: 'var(--line-height-relaxed)'
                }}>
                    {project.description?.slice(0, 80)}{project.description?.length > 80 ? '...' : ''}
                </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Clock size={12} />
                        Updated {formatDate(project.updatedAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function ProjectsPage() {
    const { clients, projects, addProject } = useData();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const getClient = (clientId) => clients.find(c => (c._id === clientId || c.id === clientId));

    const filteredProjects = projects.filter(project => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const statusCounts = {
        all: projects.length,
        'not-started': projects.filter(p => p.status === 'not-started').length,
        'in-progress': projects.filter(p => p.status === 'in-progress').length,
        'waiting-approval': projects.filter(p => p.status === 'waiting-approval').length,
        'completed': projects.filter(p => p.status === 'completed').length
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Projects</h1>
                    <p className="page-subtitle">Track and manage all your client projects</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    <Plus size={18} />
                    Create Project
                </button>
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: 'var(--space-4)',
                marginBottom: 'var(--space-6)',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                <div className="search-input-wrapper" style={{ flex: 1, maxWidth: '400px' }}>
                    <Search size={18} className="search-input-icon" />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search projects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>

                <div className="tabs" style={{ border: 'none', padding: 0 }}>
                    {[
                        { key: 'all', label: 'All' },
                        { key: 'in-progress', label: 'In Progress' },
                        { key: 'waiting-approval', label: 'Waiting' },
                        { key: 'completed', label: 'Completed' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            className={`tab ${statusFilter === tab.key ? 'active' : ''}`}
                            onClick={() => setStatusFilter(tab.key)}
                        >
                            {tab.label} ({statusCounts[tab.key]})
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            {filteredProjects.length === 0 ? (
                <div className="empty-state">
                    <FolderOpen className="empty-state-icon" />
                    <h3 className="empty-state-title">
                        {searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
                    </h3>
                    <p className="empty-state-description">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your filters'
                            : 'Create your first project to get started'
                        }
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} />
                            Create Your First Project
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
                    {filteredProjects.map((project, index) => (
                        <div key={project._id || project.id} style={{ animationDelay: `${index * 0.03}s` }}>
                            <ProjectCard project={project} client={getClient(project.clientId)} />
                        </div>
                    ))}
                </div>
            )}

            <CreateProjectModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={addProject}
                clients={clients}
            />
        </div>
    );
}
