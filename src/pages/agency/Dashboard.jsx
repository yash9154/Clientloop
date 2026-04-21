import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    Users, UserCheck, Clock, TrendingUp,
    ArrowRight, Plus, Calendar, AlertCircle
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, color = 'primary' }) {
    const colors = {
        primary: { bg: 'var(--color-primary-100)', text: 'var(--color-primary-600)' },
        success: { bg: 'var(--color-success-100)', text: 'var(--color-success-600)' },
        warning: { bg: 'var(--color-warning-100)', text: 'var(--color-warning-600)' },
        info:    { bg: 'var(--color-info-100)',    text: 'var(--color-info-600)'    },
    };
    const c = colors[color];
    return (
        <div className="stat-card animate-fade-in-up">
            <div className="stat-icon" style={{ background: c.bg, color: c.text }}>
                <Icon size={22} />
            </div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
}

function RecentClients({ clients }) {
    const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const gradients = [
        'linear-gradient(135deg,#6366f1,#8b5cf6)',
        'linear-gradient(135deg,#10b981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#3b82f6,#2563eb)',
        'linear-gradient(135deg,#ec4899,#db2777)',
    ];
    const getGradient = (name) => gradients[name.charCodeAt(0) % gradients.length];

    const statusColors = {
        active:   { bg: 'var(--color-success-100)', text: 'var(--color-success-700)' },
        inactive: { bg: 'var(--color-gray-100)',     text: 'var(--color-gray-600)'    },
        lead:     { bg: 'var(--color-info-100)',     text: 'var(--color-info-600)'    },
    };

    return (
        <div className="card animate-fade-in-up">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Recent Clients
                </h3>
                <Link to="/clients" className="btn btn-ghost btn-sm">
                    View all <ArrowRight size={14} />
                </Link>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
                {clients.length === 0 ? (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <Users size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
                        <p style={{ marginBottom: 'var(--space-4)' }}>No clients yet</p>
                        <Link to="/clients" className="btn btn-primary btn-sm">
                            <Plus size={14} /> Add First Client
                        </Link>
                    </div>
                ) : (
                    clients.slice(0, 5).map((client, i) => {
                        const sc = statusColors[client.status] || statusColors.active;
                        return (
                            <Link
                                key={client._id}
                                to={`/clients/${client._id}`}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-4) var(--space-5)',
                                    borderBottom: i < clients.slice(0,5).length - 1 ? '1px solid var(--border-light)' : 'none',
                                    transition: 'background var(--transition-fast)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div className="avatar avatar-md" style={{ background: getGradient(client.name), color: 'white', flexShrink: 0 }}>
                                    {getInitials(client.name)}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                        {client.name}
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                        {client.email}
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                    padding: '2px 10px', borderRadius: 'var(--radius-full)',
                                    background: sc.bg, color: sc.text, textTransform: 'capitalize'
                                }}>
                                    {client.status}
                                </span>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}

function FollowUpReminders({ clients }) {
    const now = new Date();
    const due = clients
        .filter(c => c.followUpDate && new Date(c.followUpDate) <= now)
        .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate));

    const upcoming = clients
        .filter(c => c.followUpDate && new Date(c.followUpDate) > now)
        .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
        .slice(0, 3);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
        <div className="card animate-fade-in-up">
            <div className="card-header">
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Follow-ups
                </h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
                {due.length === 0 && upcoming.length === 0 ? (
                    <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                        <Calendar size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
                        <p>No follow-ups scheduled</p>
                    </div>
                ) : (
                    <>
                        {due.map((client, i) => (
                            <Link
                                key={client._id}
                                to={`/clients/${client._id}`}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-5)',
                                    borderBottom: '1px solid var(--border-light)',
                                    background: 'var(--color-error-50)'
                                }}
                            >
                                <AlertCircle size={16} style={{ color: 'var(--color-error-500)', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                                        {client.name}
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error-600)' }}>
                                        Overdue · {formatDate(client.followUpDate)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {upcoming.map((client, i) => (
                            <Link
                                key={client._id}
                                to={`/clients/${client._id}`}
                                style={{
                                    display: 'flex', alignItems: 'center',
                                    gap: 'var(--space-3)',
                                    padding: 'var(--space-3) var(--space-5)',
                                    borderBottom: i < upcoming.length - 1 ? '1px solid var(--border-light)' : 'none'
                                }}
                            >
                                <Calendar size={16} style={{ color: 'var(--color-primary-500)', flexShrink: 0 }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                                        {client.name}
                                    </div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                        Due {formatDate(client.followUpDate)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}

function QuickActions() {
    return (
        <div className="card animate-fade-in-up">
            <div className="card-header">
                <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                    Quick Actions
                </h3>
            </div>
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <Link to="/clients" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                    <Plus size={18} /> Add New Client
                </Link>
                <Link to="/clients" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <Users size={18} /> View All Clients
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const { user } = useAuth();
    const { clients, getStats } = useData();
    const stats = getStats();

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">
                    Welcome back, {user?.name?.split(' ')[0]}! 👋
                </h1>
                <p className="page-subtitle">Here's an overview of your clients.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-8)' }}>
                <StatCard icon={Users}     label="Total Clients"    value={stats.totalClients}    color="primary" />
                <StatCard icon={UserCheck} label="Active Clients"   value={stats.activeClients}   color="success" />
                <StatCard icon={TrendingUp} label="Leads"           value={stats.leadClients}     color="info"    />
                <StatCard icon={Clock}     label="Follow-ups Due"   value={stats.pendingFollowUps} color="warning" />
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--space-6)' }}
                className="lg:flex lg:flex-col">
                <RecentClients clients={clients} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                    <FollowUpReminders clients={clients} />
                    <QuickActions />
                </div>
            </div>
        </div>
    );
}