import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Plus, Search, MoreHorizontal, Mail, Phone, Edit2, Trash2, X, Eye, EyeOff, Copy, Check } from 'lucide-react';

// ── ADD CLIENT MODAL ──────────────────────────────────────────────

function AddClientModal({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState({ name: '', email: '', contactName: '', phone: '', company: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await onSubmit(form);
            setForm({ name: '', email: '', contactName: '', phone: '', company: '', password: '' });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create client');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add New Client</h2>
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
                            <label className="form-label required">Company / Client Name</label>
                            <input className="form-input" placeholder="e.g. Acme Inc." value={form.name} onChange={set('name')} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Email Address</label>
                            <input className="form-input" type="email" placeholder="contact@company.com" value={form.email} onChange={set('email')} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
                            <div className="form-group">
                                <label className="form-label">Contact Person</label>
                                <input className="form-input" placeholder="Full name" value={form.contactName} onChange={set('contactName')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" placeholder="+1 234 567 8900" value={form.phone} onChange={set('phone')} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Company</label>
                            <input className="form-input" placeholder="Company name" value={form.company} onChange={set('company')} />
                        </div>
                        <div className="form-group" style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                            <label className="form-label">Portal Password</label>
                            <input className="form-input" placeholder="Default: ClientLoop@123" value={form.password} onChange={set('password')} />
                            <p className="form-helper" style={{ marginTop: 'var(--space-1)' }}>
                                Client uses this password to log into their portal. Leave blank for default.
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Add Client'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── PORTAL CREDENTIALS MODAL ─────────────────────────────────────

function CredentialsModal({ isOpen, onClose, email, password }) {
    const [copied, setCopied] = useState(false);
    const [showPass, setShowPass] = useState(false);

    if (!isOpen) return null;

    const copyAll = () => {
        navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="modal-overlay">
            <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Client Portal Credentials</h2>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ padding: 'var(--space-4)', background: 'var(--color-success-50)', border: '1px solid var(--color-success-100)', borderRadius: 'var(--radius-lg)' }}>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success-700)', fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                            ✅ Client created successfully!
                        </p>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-success-600)' }}>
                            Share these credentials with your client. The password won't be shown again.
                        </p>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Login Email</label>
                        <input className="form-input" value={email} readOnly />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input className="form-input" type={showPass ? 'text' : 'password'} value={password} readOnly style={{ paddingRight: '44px' }} />
                            <button
                                className="btn btn-ghost btn-icon"
                                onClick={() => setShowPass(!showPass)}
                                style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)' }}
                            >
                                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                        Client portal login URL: <strong>{window.location.origin}/client-login</strong>
                    </p>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" onClick={copyAll}>
                        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Credentials</>}
                    </button>
                    <button className="btn btn-primary" onClick={onClose}>Done</button>
                </div>
            </div>
        </div>
    );
}

// ── CLIENT CARD ──────────────────────────────────────────────────

function ClientCard({ client, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const gradients = [
        'linear-gradient(135deg,#6366f1,#8b5cf6)',
        'linear-gradient(135deg,#10b981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#3b82f6,#2563eb)',
        'linear-gradient(135deg,#ec4899,#db2777)',
        'linear-gradient(135deg,#14b8a6,#0d9488)',
    ];
    const getGradient = (name) => gradients[name.charCodeAt(0) % gradients.length];

    const statusStyle = {
        active:   { bg: 'var(--color-success-100)', text: 'var(--color-success-700)' },
        inactive: { bg: 'var(--color-gray-100)',     text: 'var(--color-gray-600)'    },
        lead:     { bg: 'var(--color-info-100)',     text: 'var(--color-info-600)'    },
    }[client.status] || { bg: 'var(--color-gray-100)', text: 'var(--color-gray-600)' };

    return (
        <div className="card card-hover animate-fade-in-up">
            <div className="card-body">
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div className="avatar avatar-lg" style={{ background: getGradient(client.name), color: 'white' }}>
                        {getInitials(client.name)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span style={{
                            fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                            padding: '2px 10px', borderRadius: 'var(--radius-full)',
                            background: statusStyle.bg, color: statusStyle.text, textTransform: 'capitalize'
                        }}>
                            {client.status}
                        </span>
                        <div style={{ position: 'relative' }}>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowMenu(!showMenu)}>
                                <MoreHorizontal size={18} />
                            </button>
                            {showMenu && (
                                <div className="dropdown-menu" style={{ right: 0 }}>
                                    <Link to={`/clients/${client._id}`} className="dropdown-item" onClick={() => setShowMenu(false)}>
                                        <Edit2 size={14} /> View / Edit
                                    </Link>
                                    <div className="dropdown-divider" />
                                    <button className="dropdown-item danger" onClick={() => { onDelete(client._id); setShowMenu(false); }}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Name & contact */}
                <Link to={`/clients/${client._id}`}>
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-1)', color: 'var(--text-primary)' }}>
                        {client.name}
                    </h3>
                    {client.contactName && (
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-3)' }}>
                            {client.contactName}
                        </p>
                    )}
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        <Mail size={14} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.email}</span>
                    </div>
                    {client.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                            <Phone size={14} />
                            <span>{client.phone}</span>
                        </div>
                    )}
                    {client.followUpDate && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                            color: new Date(client.followUpDate) <= new Date() ? 'var(--color-error-600)' : 'var(--color-warning-600)'
                        }}>
                            <span>📅 Follow-up: {new Date(client.followUpDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            {new Date(client.followUpDate) <= new Date() && <span style={{ color: 'var(--color-error-500)' }}> · Overdue</span>}
                        </div>
                    )}
                </div>

                <Link to={`/clients/${client._id}`} className="btn btn-secondary w-full">
                    View Details
                </Link>
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────

export default function ClientsPage() {
    const { clients, addClient, deleteClient } = useData();
    const [showAdd, setShowAdd] = useState(false);
    const [credentials, setCredentials] = useState(null); // { email, password }
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = clients.filter(c => {
        const matchesSearch =
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.contactName || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleCreate = async (formData) => {
        const result = await addClient(formData);
        // Show credentials modal with the returned password
        setCredentials({ email: formData.email, password: result.portalPassword });
    };

    const handleDelete = async (clientId) => {
        if (window.confirm('Delete this client and all their data? This cannot be undone.')) {
            await deleteClient(clientId);
        }
    };

    return (
        <div>
            {/* Header */}
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Clients</h1>
                    <p className="page-subtitle">{clients.length} client{clients.length !== 1 ? 's' : ''} total</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                    <Plus size={18} /> Add Client
                </button>
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                <div className="search-input-wrapper" style={{ flex: 1, minWidth: '200px', maxWidth: '400px' }}>
                    <Search size={18} className="search-input-icon" />
                    <input
                        type="text" className="form-input"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    {['all', 'active', 'lead', 'inactive'].map(s => (
                        <button
                            key={s}
                            className={`btn btn-sm ${statusFilter === s ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setStatusFilter(s)}
                            style={{ textTransform: 'capitalize' }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon" style={{ fontSize: '2rem' }}>👥</div>
                    <h3 className="empty-state-title">
                        {searchQuery || statusFilter !== 'all' ? 'No clients match your filters' : 'No clients yet'}
                    </h3>
                    <p className="empty-state-description">
                        {searchQuery || statusFilter !== 'all'
                            ? 'Try adjusting your search or filter'
                            : 'Add your first client to get started'}
                    </p>
                    {!searchQuery && statusFilter === 'all' && (
                        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>
                            <Plus size={18} /> Add First Client
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-6">
                    {filtered.map((client, i) => (
                        <div key={client._id} style={{ animationDelay: `${i * 0.04}s` }}>
                            <ClientCard client={client} onDelete={handleDelete} />
                        </div>
                    ))}
                </div>
            )}

            <AddClientModal
                isOpen={showAdd}
                onClose={() => setShowAdd(false)}
                onSubmit={handleCreate}
            />

            <CredentialsModal
                isOpen={!!credentials}
                onClose={() => setCredentials(null)}
                email={credentials?.email || ''}
                password={credentials?.password || ''}
            />
        </div>
    );
}