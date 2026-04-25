import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, LayoutDashboard, Settings, ChevronDown } from 'lucide-react';

export default function ClientLayout({ children }) {
    const { user, logout } = useAuth();
    const location         = useLocation();
    const [menuOpen, setMenuOpen]       = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navItems = [
        { path: '/client',          icon: LayoutDashboard, label: 'My Projects' },
        { path: '/client/settings', icon: Settings,        label: 'Settings'    },
    ];

    const isActive = (path) =>
        path === '/client'
            ? location.pathname === '/client'
            : location.pathname.startsWith(path);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            {/* Top Header */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, height: '64px',
                background: 'white', borderBottom: '1px solid var(--border-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0 var(--space-6)', zIndex: 100,
                boxShadow: 'var(--shadow-sm)'
            }}>
                {/* Logo */}
                <Link to="/client" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                        width: '34px', height: '34px',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                        ClientLoop
                    </span>
                    <span style={{
                        fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                        padding: '2px 8px', borderRadius: 'var(--radius-full)',
                        background: 'var(--color-success-100)', color: 'var(--color-success-700)',
                        marginLeft: 'var(--space-1)'
                    }}>
                        Client Portal
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }} className="md:hidden">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                                padding: 'var(--space-2) var(--space-3)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
                                color: isActive(item.path) ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                background: isActive(item.path) ? 'var(--color-primary-50)' : 'transparent',
                                textDecoration: 'none', transition: 'all var(--transition-fast)'
                            }}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* Right side — user menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    {/* Mobile menu toggle */}
                    <button
                        className="btn btn-ghost btn-icon"
                        style={{ display: 'none' }}
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* User dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            className="btn btn-ghost"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            style={{ gap: 'var(--space-2)' }}
                        >
                            <div className="avatar avatar-sm" style={{
                                background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white'
                            }}>
                                {user?.name?.charAt(0) || 'C'}
                            </div>
                            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                                {user?.name?.split(' ')[0]}
                            </span>
                            <ChevronDown size={16} />
                        </button>

                        {showUserMenu && (
                            <div className="dropdown-menu" style={{ right: 0, minWidth: '200px' }}>
                                <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border-light)' }}>
                                    <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{user?.name}</div>
                                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{user?.email}</div>
                                </div>
                                {navItems.map(item => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="dropdown-item"
                                        onClick={() => setShowUserMenu(false)}
                                    >
                                        <item.icon size={16} /> {item.label}
                                    </Link>
                                ))}
                                <div className="dropdown-divider" />
                                <button className="dropdown-item danger" onClick={logout}>
                                    <LogOut size={16} /> Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile nav drawer */}
            {menuOpen && (
                <div style={{
                    position: 'fixed', top: '64px', left: 0, right: 0,
                    background: 'white', borderBottom: '1px solid var(--border-light)',
                    padding: 'var(--space-3)', zIndex: 99,
                    display: 'flex', flexDirection: 'column', gap: 'var(--space-1)'
                }}>
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                                padding: 'var(--space-3) var(--space-4)',
                                borderRadius: 'var(--radius-lg)',
                                fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
                                color: isActive(item.path) ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                background: isActive(item.path) ? 'var(--color-primary-50)' : 'transparent',
                                textDecoration: 'none'
                            }}
                            onClick={() => setMenuOpen(false)}
                        >
                            <item.icon size={18} /> {item.label}
                        </Link>
                    ))}
                    <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)' }}>
                        <button
                            className="dropdown-item danger"
                            style={{ width: '100%' }}
                            onClick={logout}
                        >
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                </div>
            )}

            {/* Main content */}
            <main style={{ paddingTop: '64px' }}>
                {children}
            </main>
        </div>
    );
}