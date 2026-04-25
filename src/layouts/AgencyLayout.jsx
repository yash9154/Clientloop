import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
    LayoutDashboard, Users, FolderOpen,
    Settings, LogOut, Menu, X,
    ChevronDown, Bell, Check, CalendarClock
} from 'lucide-react';

// ── SIDEBAR ───────────────────────────────────────────────────────

function Sidebar({ isOpen, onClose }) {
    const location  = useLocation();
    const { user, logout } = useAuth();
    const { unreadCount } = useData();

    const navItems = [
        { path: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard'     },
        { path: '/clients',       icon: Users,           label: 'Clients'       },
        { path: '/projects',      icon: FolderOpen,      label: 'Projects'      },
        { path: '/follow-ups',    icon: CalendarClock,   label: 'Follow-ups'    },
        { path: '/notifications', icon: Bell,            label: 'Notifications', badge: unreadCount },
        { path: '/settings',      icon: Settings,        label: 'Settings'      },
    ];

    const isActive = (path) =>
        path === '/dashboard'
            ? location.pathname === '/dashboard'
            : location.pathname.startsWith(path);

    return (
        <>
            <div className={`mobile-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />
            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                {/* Logo */}
                <div className="sidebar-header">
                    <Link to="/dashboard" className="sidebar-logo">
                        <div className="sidebar-logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                            </svg>
                        </div>
                        <span className="sidebar-logo-text">ClientLoop</span>
                    </Link>
                    <button className="btn-icon mobile-menu-toggle" onClick={onClose}><X size={20} /></button>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Main Menu</div>
                        {navItems.map(item => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={onClose}
                                style={{ justifyContent: 'space-between' }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <item.icon className="sidebar-link-icon" size={20} />
                                    <span>{item.label}</span>
                                </div>
                                {item.badge > 0 && (
                                    <span style={{
                                        background: 'var(--color-error-500)', color: 'white',
                                        borderRadius: 'var(--radius-full)', minWidth: '20px', height: '20px',
                                        fontSize: '11px', fontWeight: 'bold',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '0 6px'
                                    }}>
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Client portal link */}
                    <div className="sidebar-section" style={{ marginTop: 'var(--space-4)' }}>
                        <div className="sidebar-section-title">Portal</div>
                        <a
                            href="/client-login"
                            target="_blank"
                            rel="noreferrer"
                            className="sidebar-link"
                            style={{ opacity: 0.75 }}
                            onClick={onClose}
                        >
                            <Users className="sidebar-link-icon" size={18} />
                            <span>Client Portal ↗</span>
                        </a>
                    </div>
                </nav>

                {/* Footer user info */}
                <div className="sidebar-footer">
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        gap: 'var(--space-3)', padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.1)'
                    }}>
                        <div className="avatar avatar-sm avatar-gradient">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
                                color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                            }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.6)' }}>
                                {user?.company || 'Agency'}
                            </div>
                        </div>
                        <button onClick={logout} className="btn-icon" style={{ color: 'rgba(255,255,255,0.7)' }}
                            title="Sign out">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

// ── NOTIFICATION BELL (header) ────────────────────────────────────

function NotificationBell() {
    const navigate = useNavigate();
    const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, deleteNotification } = useData();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const typeIcon = (type) => ({
        update_posted:     '📄',
        approved:          '✅',
        changes_requested: '🔁',
        comment_added:     '💬',
        client_created:    '👤'
    }[type] || '🔔');

    const formatTime = (d) => {
        const diff = Date.now() - new Date(d);
        const m = Math.floor(diff / 60000), h = Math.floor(m / 60), days = Math.floor(h / 24);
        if (m < 1) return 'Just now';
        if (m < 60) return `${m}m ago`;
        if (h < 24) return `${h}h ago`;
        return `${days}d ago`;
    };

    const handleClick = async (notif) => {
        if (!notif.read) await markNotificationRead(notif._id);
        if (notif.link) { navigate(notif.link); setOpen(false); }
    };

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setOpen(!open)} style={{ position: 'relative' }}>
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute', top: '-2px', right: '-2px',
                        background: 'var(--color-error-500)', color: 'white',
                        borderRadius: '50%', width: '18px', height: '18px',
                        fontSize: '10px', fontWeight: 'bold',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: '360px', background: 'white',
                    borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)',
                    border: '1px solid var(--border-light)', zIndex: 1000,
                    animation: 'scaleIn 0.15s ease'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', borderBottom: '1px solid var(--border-light)' }}>
                        <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                            Notifications
                            {unreadCount > 0 && <span style={{ color: 'var(--color-primary-600)', fontSize: 'var(--font-size-sm)', marginLeft: '4px' }}>({unreadCount})</span>}
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            {unreadCount > 0 && (
                                <button className="btn btn-ghost btn-sm" onClick={markAllNotificationsRead}>
                                    <Check size={14} /> All read
                                </button>
                            )}
                            <Link to="/notifications" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                                View all
                            </Link>
                        </div>
                    </div>
                    <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <Bell size={28} style={{ margin: '0 auto var(--space-2)', opacity: 0.3 }} />
                                <p style={{ fontSize: 'var(--font-size-sm)' }}>No notifications yet</p>
                            </div>
                        ) : (
                            notifications.slice(0, 6).map(notif => (
                                <div
                                    key={notif._id}
                                    style={{
                                        display: 'flex', gap: 'var(--space-3)',
                                        padding: 'var(--space-3) var(--space-4)',
                                        borderBottom: '1px solid var(--border-light)',
                                        background: notif.read ? 'transparent' : 'var(--color-primary-50)',
                                        cursor: 'pointer', transition: 'background var(--transition-fast)'
                                    }}
                                    onClick={() => handleClick(notif)}
                                    onMouseEnter={e => e.currentTarget.style.background = notif.read ? 'var(--bg-secondary)' : 'var(--color-primary-100)'}
                                    onMouseLeave={e => e.currentTarget.style.background = notif.read ? 'transparent' : 'var(--color-primary-50)'}
                                >
                                    <span style={{ fontSize: '18px', flexShrink: 0 }}>{typeIcon(notif.type)}</span>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)', marginBottom: '2px' }}>
                                            {notif.title}
                                        </div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {notif.message}
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {formatTime(notif.createdAt)}
                                        </div>
                                    </div>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        style={{ width: '24px', height: '24px', flexShrink: 0, color: 'var(--text-muted)' }}
                                        onClick={e => { e.stopPropagation(); deleteNotification(notif._id); }}
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── HEADER ────────────────────────────────────────────────────────

function Header({ onMenuClick }) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setShowUserMenu(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <header className="main-header">
            <div className="main-header-left">
                <button className="mobile-menu-toggle" onClick={onMenuClick}><Menu size={24} /></button>
            </div>
            <div className="main-header-right">
                <NotificationBell />
                <div ref={ref} style={{ position: 'relative' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ gap: 'var(--space-2)' }}
                    >
                        <div className="avatar avatar-sm avatar-gradient">{user?.name?.charAt(0) || 'U'}</div>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                            {user?.name?.split(' ')[0]}
                        </span>
                        <ChevronDown size={16} />
                    </button>
                    {showUserMenu && (
                        <div className="dropdown-menu" style={{ right: 0 }}>
                            <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-light)' }}>
                                <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{user?.name}</div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{user?.company || 'Agency'}</div>
                            </div>
                            <Link to="/settings" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                <Settings size={16} /> Settings
                            </Link>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item danger" onClick={logout}>
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default function AgencyLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <div className="main-layout">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="main-content">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <div className="page-wrapper">{children}</div>
            </div>
        </div>
    );
}