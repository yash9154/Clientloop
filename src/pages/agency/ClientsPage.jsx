import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    Plus,
    Search,
    MoreHorizontal,
    FolderOpen,
    Mail,
    Calendar,
    Edit2,
    Trash2,
    X
} from 'lucide-react';

function CreateClientModal({ isOpen, onClose, onSubmit }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactPerson, setContactPerson] = useState('');
    const [password, setPassword] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ name, email, contactName: contactPerson, password: password || 'ClientLoop@123' });
        setName('');
        setEmail('');
        setContactPerson('');
        setPassword('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Add New Client</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label required">Company Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Acme Inc."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label required">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="contact@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Contact Person</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Full name"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ marginTop: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                            <label className="form-label">Client Portal Password</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Default: ClientLoop@123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                                The client will use this password with their email to login at the client portal.
                            </p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Client
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function ClientCard({ client, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false);

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

    return (
        <div className="card card-hover animate-fade-in-up">
            <div className="card-body">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div className="avatar avatar-lg" style={{ background: getRandomGradient(client.name), color: 'white' }}>
                        {getInitials(client.name)}
                    </div>
                    <div className="dropdown" style={{ position: 'relative' }}>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreHorizontal size={18} />
                        </button>
                        {showMenu && (
                            <div className="dropdown-menu" style={{ right: 0 }}>
                                <button className="dropdown-item" onClick={() => { onEdit(client); setShowMenu(false); }}>
                                    <Edit2 size={14} />
                                    Edit
                                </button>
                                <div className="dropdown-divider" />
                                <button className="dropdown-item danger" onClick={() => { onDelete(client._id || client.id); setShowMenu(false); }}>
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <Link to={`/clients/${client._id || client.id}`}>
                    <h3 style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'var(--font-weight-semibold)',
                        marginBottom: 'var(--space-1)',
                        color: 'var(--text-primary)'
                    }}>
                        {client.name}
                    </h3>
                    <p style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-tertiary)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        {client.contactPerson}
                    </p>
                </Link>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        <Mail size={14} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {client.email}
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        <FolderOpen size={14} />
                        <span>{client.projectCount} projects</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        <Calendar size={14} />
                        <span>Added {new Date(client.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                </div>

                <Link
                    to={`/clients/${client._id || client.id}`}
                    className="btn btn-secondary w-full"
                    style={{ marginTop: 'var(--space-4)' }}
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}

export default function ClientsPage() {
    const { clients, addClient, deleteClient, subscription } = useData();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const canAddMore = subscription.currentClients < subscription.clientLimit;

    const handleCreateClient = (data) => {
        addClient(data);
    };

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Clients</h1>
                    <p className="page-subtitle">Manage your client relationships</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowCreateModal(true)}
                    disabled={!canAddMore}
                >
                    <Plus size={18} />
                    Add Client
                </button>
            </div>

            {/* Search and Filters */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <div className="search-input-wrapper" style={{ maxWidth: '400px' }}>
                    <Search size={18} className="search-input-icon" />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>

            {/* Clients Grid */}
            {filteredClients.length === 0 ? (
                <div className="empty-state">
                    <FolderOpen className="empty-state-icon" />
                    <h3 className="empty-state-title">
                        {searchQuery ? 'No clients found' : 'No clients yet'}
                    </h3>
                    <p className="empty-state-description">
                        {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'Add your first client to get started with ClientLoop'
                        }
                    </p>
                    {!searchQuery && (
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} />
                            Add Your First Client
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-6">
                    {filteredClients.map((client, index) => (
                        <div key={client._id || client.id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <ClientCard
                                client={client}
                                onEdit={(c) => console.log('Edit:', c)}
                                onDelete={deleteClient}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Client limit warning */}
            {!canAddMore && (
                <div style={{
                    marginTop: 'var(--space-6)',
                    padding: 'var(--space-4)',
                    background: 'var(--color-warning-50)',
                    border: '1px solid var(--color-warning-200)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)'
                }}>
                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-warning-700)' }}>
                            Client limit reached
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-600)' }}>
                            Upgrade your plan to add more clients
                        </div>
                    </div>
                    <Link to="/billing" className="btn btn-primary btn-sm">
                        Upgrade Plan
                    </Link>
                </div>
            )}

            <CreateClientModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateClient}
            />
        </div>
    );
}
