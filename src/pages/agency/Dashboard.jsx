import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    Users,
    FolderOpen,
    Clock,
    CheckCircle2,
    ArrowRight,
    FileText,
    MessageSquare,
    AlertCircle
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'primary', trend }) {
    const colors = {
        primary: { bg: 'var(--color-primary-100)', text: 'var(--color-primary-600)' },
        success: { bg: 'var(--color-success-100)', text: 'var(--color-success-600)' },
        warning: { bg: 'var(--color-warning-100)', text: 'var(--color-warning-600)' },
        info: { bg: 'var(--color-info-100)', text: 'var(--color-info-600)' }
    };

    return (
        <div className="stat-card animate-fade-in-up">
            <div className="stat-icon" style={{ background: colors[color].bg, color: colors[color].text }}>
                <Icon size={24} />
            </div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
}

function RecentActivity({ updates, projects, clients }) {
    const getProject = (projectId) => projects.find(p => p.id === projectId);
    const getClient = (clientId) => clients.find(c => c.id === clientId);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        if (days === 1) return 'Yesterday';
        return `${days} days ago`;
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle2 size={16} style={{ color: 'var(--color-success-500)' }} />;
            case 'changes-requested':
                return <AlertCircle size={16} style={{ color: 'var(--color-error-500)' }} />;
            default:
                return <Clock size={16} style={{ color: 'var(--color-warning-500)' }} />;
        }
    };

    return (
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.1s backwards' }}>
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Recent Updates
                </h3>
                <Link to="/projects" className="btn btn-ghost btn-sm">
                    View all <ArrowRight size={14} />
                </Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
                {updates.slice(0, 5).map((update, index) => {
                    const project = getProject(update.projectId);
                    const client = project ? getClient(project.clientId) : null;

                    return (
                        <Link
                            key={update.id}
                            to={`/projects/${update.projectId}`}
                            className="transition-colors"
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 'var(--space-4)',
                                padding: 'var(--space-4) var(--space-6)',
                                borderBottom: index < 4 ? '1px solid var(--border-light)' : 'none'
                            }}
                        >
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: 'var(--radius-full)',
                                background: 'var(--color-primary-100)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-primary-600)',
                                flexShrink: 0
                            }}>
                                <FileText size={18} />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                    fontWeight: 'var(--font-weight-medium)',
                                    marginBottom: 'var(--space-1)',
                                    color: 'var(--text-primary)'
                                }}>
                                    {update.title}
                                </div>
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    color: 'var(--text-tertiary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)'
                                }}>
                                    <span>{project?.name}</span>
                                    <span>•</span>
                                    <span>{client?.name}</span>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 'var(--space-2)'
                            }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                    {formatTime(update.createdAt)}
                                </span>
                                {update.approvalStatus && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                        {getStatusIcon(update.approvalStatus)}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function PendingApprovals({ updates, projects, clients }) {
    const pendingUpdates = updates.filter(u => u.approvalStatus === 'pending');
    const getProject = (projectId) => projects.find(p => p.id === projectId);
    const getClient = (clientId) => clients.find(c => c.id === clientId);

    return (
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.2s backwards' }}>
            <div className="card-header">
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Pending Approvals
                </h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
                {pendingUpdates.length === 0 ? (
                    <div style={{
                        padding: 'var(--space-8)',
                        textAlign: 'center',
                        color: 'var(--text-tertiary)'
                    }}>
                        <CheckCircle2 size={40} style={{ margin: '0 auto var(--space-3)', opacity: 0.5 }} />
                        <p>No pending approvals</p>
                    </div>
                ) : (
                    pendingUpdates.slice(0, 4).map((update, index) => {
                        const project = getProject(update.projectId);
                        const client = project ? getClient(project.clientId) : null;

                        return (
                            <Link
                                key={update.id}
                                to={`/projects/${update.projectId}`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-4) var(--space-6)',
                                    borderBottom: index < pendingUpdates.length - 1 ? '1px solid var(--border-light)' : 'none'
                                }}
                                className="transition-colors"
                            >
                                <div className="avatar avatar-sm avatar-gradient">
                                    {client?.name?.charAt(0) || '?'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontWeight: 'var(--font-weight-medium)',
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--text-primary)',
                                        marginBottom: '2px'
                                    }}>
                                        {update.title}
                                    </div>
                                    <div style={{
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--text-tertiary)'
                                    }}>
                                        {client?.name}
                                    </div>
                                </div>
                                <span className="badge badge-pending">Pending</span>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function QuickActions() {
    return (
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease 0.3s backwards' }}>
            <div className="card-header">
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Quick Actions
                </h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Link to="/clients" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <Users size={18} />
                    Add New Client
                </Link>
                <Link to="/projects" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <FolderOpen size={18} />
                    Create Project
                </Link>
                <Link to="/projects" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <MessageSquare size={18} />
                    Post Update
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const { clients, projects, updates, getStats } = useData();
    const stats = getStats();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
                <p className="page-subtitle">Here's what's happening with your projects today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <StatCard
                    icon={Users}
                    label="Total Clients"
                    value={stats.totalClients}
                    color="primary"
                />
                <StatCard
                    icon={FolderOpen}
                    label="Active Projects"
                    value={stats.totalProjects}
                    color="info"
                />
                <StatCard
                    icon={Clock}
                    label="Pending Approvals"
                    value={stats.pendingApprovals}
                    color="warning"
                />
                <StatCard
                    icon={CheckCircle2}
                    label="Completed"
                    value={stats.completedProjects}
                    color="success"
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-6">
                <div style={{ gridColumn: 'span 2' }} className="lg:grid-cols-1">
                    <RecentActivity updates={updates} projects={projects} clients={clients} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <PendingApprovals updates={updates} projects={projects} clients={clients} />
                    <QuickActions />
                </div>
            </div>
        </div>
    );
}
