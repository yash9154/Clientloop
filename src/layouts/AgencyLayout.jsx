import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown
} from 'lucide-react';

function Sidebar({ isOpen, onClose }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/clients', icon: Users, label: 'Clients' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        if (path === '/dashboard') return location.pathname === '/dashboard';
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <div className={`mobile-overlay ${isOpen ? 'visible' : ''}`} onClick={onClose} />

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
                        display: 'flex', alignItems: 'center',
                        gap: 'var(--space-3)', padding: 'var(--space-3)',
                        borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255,255,255,0.1)'
                    }}>
                        <div className="avatar avatar-sm avatar-gradient">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'white', whiteSpace: 'nowrap',
                                overflow: 'hidden', textOverflow: 'ellipsis'
                            }}>
                                {user?.name}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'rgba(255,255,255,0.6)' }}>
                                {user?.company || 'Agency'}
                            </div>
                        </div>
                        <button onClick={logout} className="btn-icon" style={{ color: 'rgba(255,255,255,0.7)' }}>
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
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <header className="main-header">
            <div className="main-header-left">
                <button className="mobile-menu-toggle" onClick={onMenuClick}>
                    <Menu size={24} />
                </button>
            </div>

            <div className="main-header-right">
                <div className="dropdown" style={{ position: 'relative' }}>
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        style={{ gap: 'var(--space-2)' }}
                    >
                        <div className="avatar avatar-sm avatar-gradient">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                            {user?.name?.split(' ')[0]}
                        </span>
                        <ChevronDown size={16} />
                    </button>

                    {showUserMenu && (
                        <div className="dropdown-menu" style={{ right: 0 }}>
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
                <div className="page-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}