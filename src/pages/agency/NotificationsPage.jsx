import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, X } from 'lucide-react';

export default function NotificationsPage() {
    const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification } = useData();
    const navigate = useNavigate();

    const typeIcon = (type) => ({
        update_posted:     '📄',
        approved:          '✅',
        changes_requested: '🔁',
        comment_added:     '💬',
        client_created:    '👤'
    }[type] || '🔔');

    const typeLabel = (type) => ({
        update_posted:     'New Update',
        approved:          'Approved',
        changes_requested: 'Changes Requested',
        comment_added:     'New Comment',
        client_created:    'Client Created'
    }[type] || 'Notification');

    const formatDate = (d) => {
        const diff = Date.now() - new Date(d);
        const m = Math.floor(diff / 60000), h = Math.floor(m / 60), days = Math.floor(h / 24);
        if (m < 1)  return 'Just now';
        if (m < 60) return `${m} minutes ago`;
        if (h < 24) return `${h} hours ago`;
        if (days === 1) return 'Yesterday';
        return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleClick = async (notif) => {
        if (!notif.read) await markNotificationRead(notif._id);
        if (notif.link) navigate(notif.link);
    };

    const unread  = notifications.filter(n => !n.read);
    const read    = notifications.filter(n => n.read);

    return (
        <div>
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div>
                    <h1 className="page-title">Notifications</h1>
                    <p className="page-subtitle">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <button className="btn btn-secondary" onClick={markAllNotificationsRead}>
                        <Check size={16} /> Mark all as read
                    </button>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="empty-state">
                    <Bell className="empty-state-icon" />
                    <h3 className="empty-state-title">No notifications yet</h3>
                    <p className="empty-state-description">
                        Notifications will appear here when clients approve updates, request changes, or leave comments.
                    </p>
                </div>
            ) : (
                <div style={{ maxWidth: '700px' }}>
                    {/* Unread */}
                    {unread.length > 0 && (
                        <div style={{ marginBottom: 'var(--space-6)' }}>
                            <h2 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                                New — {unread.length}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {unread.map(notif => (
                                    <NotifCard
                                        key={notif._id}
                                        notif={notif}
                                        onClick={() => handleClick(notif)}
                                        onDelete={() => deleteNotification(notif._id)}
                                        typeIcon={typeIcon}
                                        typeLabel={typeLabel}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Read */}
                    {read.length > 0 && (
                        <div>
                            <h2 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-3)' }}>
                                Earlier — {read.length}
                            </h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                {read.map(notif => (
                                    <NotifCard
                                        key={notif._id}
                                        notif={notif}
                                        onClick={() => handleClick(notif)}
                                        onDelete={() => deleteNotification(notif._id)}
                                        typeIcon={typeIcon}
                                        typeLabel={typeLabel}
                                        formatDate={formatDate}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function NotifCard({ notif, onClick, onDelete, typeIcon, typeLabel, formatDate }) {
    return (
        <div
            className="card"
            style={{
                cursor: notif.link ? 'pointer' : 'default',
                border: !notif.read ? '1px solid var(--color-primary-200)' : '1px solid var(--border-light)',
                background: !notif.read ? 'var(--color-primary-50)' : 'white',
                transition: 'all var(--transition-fast)'
            }}
            onClick={onClick}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
        >
            <div className="card-body" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start', padding: 'var(--space-4)' }}>
                <div style={{
                    width: '42px', height: '42px', flexShrink: 0,
                    background: !notif.read ? 'var(--color-primary-100)' : 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px'
                }}>
                    {typeIcon(notif.type)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{
                                fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                padding: '1px 8px', borderRadius: 'var(--radius-full)',
                                background: 'var(--color-primary-100)', color: 'var(--color-primary-700)'
                            }}>
                                {typeLabel(notif.type)}
                            </span>
                            {!notif.read && (
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-primary-500)', display: 'inline-block' }} />
                            )}
                        </div>
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', flexShrink: 0 }}>
                            {formatDate(notif.createdAt)}
                        </span>
                    </div>
                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginBottom: '4px' }}>
                        {notif.title}
                    </div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                        {notif.message}
                    </div>
                </div>
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ width: '28px', height: '28px', flexShrink: 0, color: 'var(--text-muted)' }}
                    onClick={e => { e.stopPropagation(); onDelete(); }}
                    title="Delete notification"
                >
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}