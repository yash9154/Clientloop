import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import {
    LayoutDashboard,
    Users,
    FolderOpen,
    CreditCard,
    Settings,
    Bell,
    LogOut,
    Menu,
    X,
    Search,
    ChevronDown
} from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/clients', icon: Users, label: 'Clients' },
        { path: '/projects', icon: FolderOpen, label: 'Projects' },
        { path: '/billing', icon: CreditCard, label: 'Billing' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`mobile-overlay ${isOpen ? 'visible' : ''}`}
                onClick={onClose}
            />

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/dashboard" className="sidebar-logo">
                        <div className="sidebar-logo-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" />
                                <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                            </svg>
                        </div>
                        <span className="sidebar-logo-text">ClientLoop</span>
                    </Link>

                    <button className="btn-icon mobile-menu-toggle" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="sidebar-section">
                        <div className="sidebar-section-title">Menu</div>
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                                onClick={onClose}
                            >
                                <item.icon className="sidebar-link-icon" size={20} />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="sidebar-footer">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255, 255, 255, 0.1)'
                    }}>
                        <div className="avatar avatar-sm avatar-gradient">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'white',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {user?.name}
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-xs)',
                                color: 'rgba(255, 255, 255, 0.6)'
                            }}>
                                {user?.company}
                            </div>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="btn-icon"
                            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}

function Header({ onMenuClick }) {
    const { user, logout } = useAuth();
    const { getUnreadCount, notifications, markNotificationRead, markAllNotificationsRead } = useData();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const unreadCount = getUnreadCount();

    return (
        <header className="main-header">
            <div className="main-header-left">
                <button className="mobile-menu-toggle" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>

                <div className="search-input-wrapper" style={{ display: 'none' }}>
                    <Search size={18} className="search-input-icon" />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search clients, projects..."
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>

            <div className="main-header-right">
                {/* Notifications */}
                <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                        className="btn btn-ghost btn-icon"
                        onClick={() => setShowNotifications(!showNotifications)}
                        style={{ position: 'relative' }}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="notification-dot" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="dropdown-menu" style={{ width: '360px', right: 0 }}>
                            <div style={{
                                padding: 'var(--space-3) var(--space-4)',
                                borderBottom: '1px solid var(--border-light)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>Notifications</span>
                                {unreadCount > 0 && (
                                    <button
                                        className="btn btn-ghost btn-sm"
                                        onClick={() => markAllNotificationsRead()}
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {notifications.length === 0 ? (
                                    <div style={{
                                        padding: 'var(--space-6)',
                                        textAlign: 'center',
                                        color: 'var(--text-tertiary)'
                                    }}>
                                        No notifications
                                    </div>
                                ) : (
                                    notifications.slice(0, 5).map((notif) => (
                                        <div
                                            key={notif.id}
                                            className="dropdown-item"
                                            onClick={() => markNotificationRead(notif.id)}
                                            style={{
                                                padding: 'var(--space-3) var(--space-4)',
                                                background: notif.read ? 'transparent' : 'var(--color-primary-50)'
                                            }}
                                        >
                                            <div>
                                                <div style={{
                                                    fontWeight: 'var(--font-weight-medium)',
                                                    fontSize: 'var(--font-size-sm)'
                                                }}>
                                                    {notif.title}
                                                </div>
                                                <div style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: 'var(--text-tertiary)',
                                                    marginTop: 'var(--space-1)'
                                                }}>
                                                    {notif.message}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* User Menu */}
                <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ gap: 'var(--space-2)' }}
                    >
                        <div className="avatar avatar-sm avatar-gradient">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="sm:hidden" style={{
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)'
                        }}>
                            {user?.name?.split(' ')[0]}
                        </span>
                        <ChevronDown size={16} />
                    </button>

                    {showUserMenu && (
                        <div className="dropdown-menu">
                            <Link to="/settings" className="dropdown-item">
                                <Settings size={16} />
                                Settings
                            </Link>
                            <div className="dropdown-divider" />
                            <button className="dropdown-item danger" onClick={() => logout()}>
                                <LogOut size={16} />
                                Sign Out
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
                <div className="page-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}
