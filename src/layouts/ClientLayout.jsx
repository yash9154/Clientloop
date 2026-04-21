import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function ClientLayout({ children }) {
    const { user, logout } = useAuth();
    const [showUserMenu, setShowUserMenu] = useState(false);

    return (
        <div className="client-layout">
            <header className="client-header">
                <Link to="/client" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                        ClientLoop
                    </span>
                </Link>

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
                            <button className="dropdown-item danger" onClick={logout}>
                                <LogOut size={16} /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="client-content">
                {children}
            </main>
        </div>
    );
}