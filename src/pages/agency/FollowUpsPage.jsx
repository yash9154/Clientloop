import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    CalendarClock, AlertCircle, Calendar,
    CheckCircle2, Clock, Plus, ArrowRight
} from 'lucide-react';

export default function FollowUpsPage() {
    const { clients, updateClient } = useData();
    const [filter, setFilter] = useState('all');

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    // Categorise clients
    const overdue   = clients.filter(c => c.followUpDate && new Date(c.followUpDate) < now);
    const today     = clients.filter(c => {
        if (!c.followUpDate) return false;
        const d = new Date(c.followUpDate);
        d.setHours(0,0,0,0);
        return d.getTime() === now.getTime();
    });
    const thisWeek  = clients.filter(c => {
        if (!c.followUpDate) return false;
        const d = new Date(c.followUpDate);
        d.setHours(0,0,0,0);
        return d > now && d <= nextWeek;
    });
    const upcoming  = clients.filter(c => c.followUpDate && new Date(c.followUpDate) > nextWeek);
    const noneSet   = clients.filter(c => !c.followUpDate);

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
    });

    const getDaysUntil = (d) => {
        const diff = new Date(d) - now;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
        if (days < 0)  return `${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''} overdue`;
        if (days === 0) return 'Today';
        if (days === 1) return 'Tomorrow';
        return `In ${days} days`;
    };

    const handleClearFollowUp = async (clientId) => {
        await updateClient(clientId, { followUpDate: null });
    };

    const statusConfig = {
        active:   { bg: 'var(--color-success-100)', text: 'var(--color-success-700)' },
        inactive: { bg: 'var(--color-gray-100)',     text: 'var(--color-gray-600)'   },
        lead:     { bg: 'var(--color-info-100)',     text: 'var(--color-info-600)'   },
    };

    const gradients = [
        'linear-gradient(135deg,#6366f1,#8b5cf6)',
        'linear-gradient(135deg,#10b981,#059669)',
        'linear-gradient(135deg,#f59e0b,#d97706)',
        'linear-gradient(135deg,#3b82f6,#2563eb)',
        'linear-gradient(135deg,#ec4899,#db2777)',
    ];
    const getGradient = (name) => gradients[(name||'A').charCodeAt(0) % gradients.length];
    const getInitials = (name) => (name||'??').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);

    function ClientRow({ client, urgent }) {
        const sc = statusConfig[client.status] || statusConfig.active;
        const isOverdue = client.followUpDate && new Date(client.followUpDate) < now;

        return (
            <div className="card animate-fade-in-up" style={{
                border: isOverdue ? '2px solid var(--color-error-200)' : '1px solid var(--border-light)',
                background: isOverdue ? 'var(--color-error-50)' : 'white'
            }}>
                <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap', padding: 'var(--space-4)' }}>
                    <div className="avatar avatar-md" style={{ background: getGradient(client.name), color: 'white', flexShrink: 0 }}>
                        {getInitials(client.name)}
                    </div>
                    <div style={{ flex: 1, minWidth: '160px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)' }}>{client.name}</span>
                            <span style={{ fontSize: 'var(--font-size-xs)', padding: '1px 8px', borderRadius: 'var(--radius-full)', background: sc.bg, color: sc.text, textTransform: 'capitalize' }}>
                                {client.status}
                            </span>
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{client.email}</div>
                    </div>
                    {client.followUpDate && (
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{
                                fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)',
                                color: isOverdue ? 'var(--color-error-600)' : 'var(--text-primary)'
                            }}>
                                {getDaysUntil(client.followUpDate)}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                {formatDate(client.followUpDate)}
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                        <Link to={`/clients/${client._id}`} className="btn btn-primary btn-sm">
                            View Client <ArrowRight size={14} />
                        </Link>
                        {client.followUpDate && (
                            <button
                                className="btn btn-ghost btn-sm"
                                style={{ color: 'var(--color-success-600)' }}
                                onClick={() => handleClearFollowUp(client._id)}
                                title="Mark follow-up as done"
                            >
                                <CheckCircle2 size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const totalDue = overdue.length + today.length;

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Follow-ups</h1>
                    <p className="page-subtitle">
                        {totalDue > 0
                            ? `${totalDue} follow-up${totalDue > 1 ? 's' : ''} need attention today`
                            : 'No follow-ups due today'}
                    </p>
                </div>
                <Link to="/clients" className="btn btn-primary">
                    <Plus size={18} /> Add Client
                </Link>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-4" style={{ marginBottom: 'var(--space-6)' }}>
                {[
                    { label: 'Overdue',    value: overdue.length,  color: 'var(--color-error-600)',   bg: 'var(--color-error-100)',   icon: AlertCircle  },
                    { label: 'Due Today',  value: today.length,    color: 'var(--color-warning-600)', bg: 'var(--color-warning-100)', icon: Clock        },
                    { label: 'This Week',  value: thisWeek.length, color: 'var(--color-info-600)',    bg: 'var(--color-info-100)',    icon: Calendar     },
                    { label: 'Upcoming',   value: upcoming.length, color: 'var(--color-success-600)', bg: 'var(--color-success-100)', icon: CalendarClock},
                ].map(s => (
                    <div key={s.label} className="stat-card">
                        <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                            <s.icon size={20} />
                        </div>
                        <div className="stat-content">
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value">{s.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                {[
                    { key: 'all',      label: `All (${overdue.length + today.length + thisWeek.length + upcoming.length})` },
                    { key: 'overdue',  label: `Overdue (${overdue.length})`  },
                    { key: 'today',    label: `Today (${today.length})`       },
                    { key: 'week',     label: `This Week (${thisWeek.length})` },
                    { key: 'upcoming', label: `Upcoming (${upcoming.length})` },
                    { key: 'none',     label: `Not Set (${noneSet.length})`   },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Lists */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

                {(filter === 'all' || filter === 'overdue') && overdue.length > 0 && (
                    <Section title="⚠️ Overdue" color="var(--color-error-600)" clients={overdue} ClientRow={ClientRow} />
                )}

                {(filter === 'all' || filter === 'today') && today.length > 0 && (
                    <Section title="📅 Due Today" color="var(--color-warning-600)" clients={today} ClientRow={ClientRow} />
                )}

                {(filter === 'all' || filter === 'week') && thisWeek.length > 0 && (
                    <Section title="📆 This Week" color="var(--color-info-600)" clients={thisWeek} ClientRow={ClientRow} />
                )}

                {(filter === 'all' || filter === 'upcoming') && upcoming.length > 0 && (
                    <Section title="🗓️ Upcoming" color="var(--color-success-600)" clients={upcoming} ClientRow={ClientRow} />
                )}

                {(filter === 'all' || filter === 'none') && noneSet.length > 0 && (
                    <div>
                        <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                            No Follow-up Set ({noneSet.length})
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                            {noneSet.map(client => <ClientRow key={client._id} client={client} />)}
                        </div>
                    </div>
                )}

                {clients.length === 0 && (
                    <div className="empty-state">
                        <CalendarClock className="empty-state-icon" />
                        <h3 className="empty-state-title">No clients yet</h3>
                        <p className="empty-state-description">Add clients and set follow-up dates to track them here.</p>
                        <Link to="/clients" className="btn btn-primary"><Plus size={18} /> Add Client</Link>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-4)', background: 'var(--color-primary-50)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-primary-100)' }}>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-700)' }}>
                    💡 <strong>Tip:</strong> Set follow-up dates when editing a client. Click the ✅ button to mark a follow-up as done and clear the date.
                </p>
            </div>
        </div>
    );
}

function Section({ title, color, clients, ClientRow }) {
    return (
        <div>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color, marginBottom: 'var(--space-3)' }}>
                {title} ({clients.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {clients.map(client => <ClientRow key={client._id} client={client} />)}
            </div>
        </div>
    );
}