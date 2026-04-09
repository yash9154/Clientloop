import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    ArrowLeft,
    Mail,
    Calendar,
    FolderOpen,
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    Pause,
    Edit2,
    Key,
    X,
    Save,
    Phone,
    Building2,
    User
} from 'lucide-react';

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

function ProjectCard({ project }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Link to={`/projects/${project._id || project.id}`} className="card card-hover" style={{ display: 'block' }}>
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-base)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--text-primary)'
                    }}>
                        {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                </div>
                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)',
                    marginBottom: 'var(--space-4)',
                    lineHeight: 'var(--line-height-relaxed)'
                }}>
                    {project.description}
                </p>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)'
                }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Calendar size={12} />
                        Created {formatDate(project.createdAt)}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Clock size={12} />
                        Updated {formatDate(project.updatedAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function EditClientModal({ isOpen, onClose, client, onSave }) {
    const [name, setName] = useState(client?.name || '');
    const [email, setEmail] = useState(client?.email || '');
    const [contactName, setContactName] = useState(client?.contactName || client?.contactPerson || '');
    const [phone, setPhone] = useState(client?.phone || '');
    const [company, setCompany] = useState(client?.company || '');
    const [password, setPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        try {
            const updateData = { name, email, contactName, phone, company };
            if (password.trim()) {
                updateData.password = password;
            }
            await onSave(updateData);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update client');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Client</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && (
                            <div style={{
                                padding: 'var(--space-3) var(--space-4)',
                                background: 'var(--color-error-50)',
                                border: '1px solid var(--color-error-200)',
                                borderRadius: 'var(--radius-lg)',
                                color: 'var(--color-error-600)',
                                fontSize: 'var(--font-size-sm)',
                                marginBottom: 'var(--space-4)'
                            }}>
                                {error}
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label required">
                                    <Building2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label required">
                                    <Mail size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    <User size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                    Contact Person
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={contactName}
                                    onChange={(e) => setContactName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    <Phone size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                            <label className="form-label">
                                <Building2 size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                                Industry / Company
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="e.g., Technology, Healthcare"
                            />
                        </div>

                        {/* Password Section */}
                        <div style={{
                            marginTop: 'var(--space-6)',
                            padding: 'var(--space-4)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid var(--border-light)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-2)',
                                marginBottom: 'var(--space-3)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--text-primary)'
                            }}>
                                <Key size={16} />
                                Client Portal Access
                            </div>
                            <p style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-tertiary)',
                                marginBottom: 'var(--space-3)'
                            }}>
                                Set or update the password for this client's portal login. Leave blank to keep the current password.
                            </p>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter new password (min 6 characters)"
                                    minLength={password.trim() ? 6 : undefined}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ClientDetailPage() {
    const { clientId } = useParams();
    const navigate = useNavigate();
    const { getClient, getProjectsByClient, updateClient, deleteClient } = useData();
    const [showEditModal, setShowEditModal] = useState(false);

    const client = getClient(clientId);
    const projects = getProjectsByClient(clientId);

    if (!client) {
        return (
            <div className="empty-state">
                <AlertCircle className="empty-state-icon" />
                <h3 className="empty-state-title">Client not found</h3>
                <p className="empty-state-description">The client you're looking for doesn't exist.</p>
                <Link to="/clients" className="btn btn-primary">
                    <ArrowLeft size={18} />
                    Back to Clients
                </Link>
            </div>
        );
    }

    const cid = client._id || client.id;

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getRandomGradient = (name) => {
        const gradients = [
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)'
        ];
        const index = name.charCodeAt(0) % gradients.length;
        return gradients[index];
    };

    const projectStats = {
        total: projects.length,
        inProgress: projects.filter(p => p.status === 'in-progress').length,
        waiting: projects.filter(p => p.status === 'waiting-approval').length,
        completed: projects.filter(p => p.status === 'completed').length
    };

    const handleSaveClient = async (data) => {
        await updateClient(cid, data);
    };

    const handleDeleteClient = async () => {
        if (window.confirm('Are you sure you want to delete this client? All associated projects and data will be removed.')) {
            await deleteClient(cid);
            navigate('/clients');
        }
    };

    return (
        <div>
            {/* Breadcrumb */}
            <Link
                to="/clients"
                className="btn btn-ghost"
                style={{ marginBottom: 'var(--space-4)', marginLeft: '-12px' }}
            >
                <ArrowLeft size={18} />
                Back to Clients
            </Link>

            {/* Client Header */}
            <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body" style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                    <div className="avatar avatar-xl" style={{
                        background: getRandomGradient(client.name),
                        color: 'white',
                        fontSize: 'var(--font-size-2xl)'
                    }}>
                        {getInitials(client.name)}
                    </div>

                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <h1 style={{
                            fontSize: 'var(--font-size-2xl)',
                            fontWeight: 'var(--font-weight-bold)',
                            marginBottom: 'var(--space-2)'
                        }}>
                            {client.name}
                        </h1>
                        <p style={{
                            color: 'var(--text-secondary)',
                            marginBottom: 'var(--space-4)'
                        }}>
                            {client.contactName || client.contactPerson}
                        </p>
                        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)' }}>
                                <Mail size={16} />
                                <span>{client.email}</span>
                            </div>
                            {client.phone && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)' }}>
                                    <Phone size={16} />
                                    <span>{client.phone}</span>
                                </div>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)' }}>
                                <Calendar size={16} />
                                <span>Client since {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowEditModal(true)}
                        >
                            <Edit2 size={16} />
                            Edit Client
                        </button>
                        <button
                            className="btn btn-ghost"
                            onClick={handleDeleteClient}
                            style={{ color: 'var(--color-error-600)' }}
                        >
                            Delete
                        </button>
                    </div>
                </div>

                {/* Project Stats */}
                <div style={{
                    display: 'flex',
                    gap: 'var(--space-6)',
                    padding: 'var(--space-4) var(--space-6)',
                    borderTop: '1px solid var(--border-light)',
                    background: 'var(--bg-secondary)',
                    borderRadius: '0 0 var(--radius-xl) var(--radius-xl)'
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                            {projectStats.total}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Projects</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info-600)' }}>
                            {projectStats.inProgress}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>In Progress</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success-600)' }}>
                            {projectStats.completed}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>Completed</div>
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Projects
                </h2>
                <Link to="/projects" className="btn btn-primary btn-sm">
                    <Plus size={16} />
                    New Project
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="card">
                    <div className="empty-state" style={{ padding: 'var(--space-12)' }}>
                        <FolderOpen className="empty-state-icon" />
                        <h3 className="empty-state-title">No projects yet</h3>
                        <p className="empty-state-description">
                            Create your first project for this client to get started.
                        </p>
                        <Link to="/projects" className="btn btn-primary">
                            <Plus size={18} />
                            Create Project
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {projects.map((project, index) => (
                        <div key={project._id || project.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
                            <ProjectCard project={project} />
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Client Modal */}
            <EditClientModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                client={client}
                onSave={handleSaveClient}
            />
        </div>
    );
}
