import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    User,
    Mail,
    Building2,
    Bell,
    Lock,
    Palette,
    Save,
    Camera
} from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile form state
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [company, setCompany] = useState(user?.company || '');

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        emailApprovals: true,
        emailComments: true,
        emailDigest: false
    });

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'branding', label: 'Branding', icon: Palette }
    ];

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account and preferences</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                {/* Sidebar Tabs */}
                <div style={{ width: '200px', flexShrink: 0 }} className="md:hidden">
                    <div className="card">
                        <div style={{ padding: 'var(--space-2)' }}>
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`sidebar-link ${activeTab === tab.id ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        width: '100%',
                                        background: activeTab === tab.id ? 'var(--color-primary-50)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--color-primary-600)' : 'var(--text-secondary)'
                                    }}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Mobile Tabs */}
                <div className="tabs md:flex" style={{ display: 'none', marginBottom: 'var(--space-4)', width: '100%' }}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="card animate-fade-in">
                            <div className="card-header">
                                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                                    Profile Information
                                </h2>
                            </div>
                            <div className="card-body">
                                {/* Avatar */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-4)',
                                    marginBottom: 'var(--space-6)'
                                }}>
                                    <div
                                        className="avatar avatar-xl avatar-gradient"
                                        style={{ fontSize: 'var(--font-size-2xl)' }}
                                    >
                                        {name.charAt(0)}
                                    </div>
                                    <div>
                                        <button className="btn btn-secondary btn-sm">
                                            <Camera size={14} />
                                            Change Photo
                                        </button>
                                        <p style={{
                                            fontSize: 'var(--font-size-xs)',
                                            color: 'var(--text-tertiary)',
                                            marginTop: 'var(--space-2)'
                                        }}>
                                            JPG or PNG. Max 2MB.
                                        </p>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-4)' }} className="md:grid-cols-1">
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <User size={18} style={{
                                                position: 'absolute',
                                                left: '14px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--text-muted)'
                                            }} />
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                style={{ paddingLeft: '44px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={{
                                                position: 'absolute',
                                                left: '14px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--text-muted)'
                                            }} />
                                            <input
                                                type="email"
                                                className="form-input"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                style={{ paddingLeft: '44px' }}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                        <label className="form-label">Company Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <Building2 size={18} style={{
                                                position: 'absolute',
                                                left: '14px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'var(--text-muted)'
                                            }} />
                                            <input
                                                type="text"
                                                className="form-input"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                style={{ paddingLeft: '44px' }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ marginTop: 'var(--space-6)' }}>
                                    <button className="btn btn-primary">
                                        <Save size={16} />
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="card animate-fade-in">
                            <div className="card-header">
                                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                                    Email Notifications
                                </h2>
                            </div>
                            <div className="card-body">
                                <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)' }}>
                                    Choose which notifications you'd like to receive.
                                </p>

                                {[
                                    { key: 'emailUpdates', label: 'Project Updates', description: 'Get notified when a new update is posted' },
                                    { key: 'emailApprovals', label: 'Approval Requests', description: 'Get notified when approval is given or changes are requested' },
                                    { key: 'emailComments', label: 'New Comments', description: 'Get notified when someone comments on your updates' },
                                    { key: 'emailDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of all activity' }
                                ].map((item) => (
                                    <label
                                        key={item.key}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            gap: 'var(--space-4)',
                                            padding: 'var(--space-4)',
                                            borderBottom: '1px solid var(--border-light)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.key]}
                                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                                            style={{ width: '20px', height: '20px', marginTop: '2px' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{item.label}</div>
                                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                                {item.description}
                                            </div>
                                        </div>
                                    </label>
                                ))}

                                <div style={{ marginTop: 'var(--space-6)' }}>
                                    <button className="btn btn-primary">
                                        <Save size={16} />
                                        Save Preferences
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="card animate-fade-in">
                            <div className="card-header">
                                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                                    Security Settings
                                </h2>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    <h3 style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-3)' }}>
                                        Change Password
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
                                        <div className="form-group">
                                            <label className="form-label">Current Password</label>
                                            <input type="password" className="form-input" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">New Password</label>
                                            <input type="password" className="form-input" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Confirm New Password</label>
                                            <input type="password" className="form-input" />
                                        </div>
                                        <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                                            Update Password
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    borderTop: '1px solid var(--border-light)',
                                    paddingTop: 'var(--space-6)',
                                    marginTop: 'var(--space-6)'
                                }}>
                                    <h3 style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                                        Two-Factor Authentication
                                    </h3>
                                    <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                                        Add an extra layer of security to your account.
                                    </p>
                                    <button className="btn btn-secondary">
                                        Enable 2FA
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Branding Tab */}
                    {activeTab === 'branding' && (
                        <div className="card animate-fade-in">
                            <div className="card-header">
                                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                                    Branding
                                </h2>
                            </div>
                            <div className="card-body">
                                <div style={{
                                    padding: 'var(--space-6)',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '64px',
                                        height: '64px',
                                        background: 'var(--color-primary-100)',
                                        borderRadius: 'var(--radius-full)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto var(--space-4)',
                                        color: 'var(--color-primary-600)'
                                    }}>
                                        <Palette size={28} />
                                    </div>
                                    <h3 style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-2)' }}>
                                        Custom Branding
                                    </h3>
                                    <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>
                                        Add your logo and brand colors to the client portal.
                                    </p>
                                    <span className="badge badge-primary">Available on Starter & Agency plans</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
