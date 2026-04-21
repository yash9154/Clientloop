import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiUpdateProfile, apiChangePassword } from '../../api/auth.js';
import { User, Mail, Building2, Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile
    const [name, setName]       = useState(user?.name || '');
    const [company, setCompany] = useState(user?.company || '');
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg]       = useState('');
    const [profileError, setProfileError]   = useState('');

    // Password
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword]         = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent]         = useState(false);
    const [showNew, setShowNew]                 = useState(false);
    const [passwordSaving, setPasswordSaving]   = useState(false);
    const [passwordMsg, setPasswordMsg]         = useState('');
    const [passwordError, setPasswordError]     = useState('');

    const tabs = [
        { id: 'profile',  label: 'Profile',  icon: User },
        { id: 'security', label: 'Security', icon: Lock },
    ];

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setProfileSaving(true); setProfileMsg(''); setProfileError('');
        try {
            await apiUpdateProfile({ name, company });
            setProfileMsg('Profile updated successfully.');
        } catch (err) {
            setProfileError(err.message || 'Failed to update profile.');
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMsg(''); setPasswordError('');
        if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match.'); return; }
        setPasswordSaving(true);
        try {
            await apiChangePassword(currentPassword, newPassword);
            setPasswordMsg('Password changed successfully.');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            setPasswordError(err.message || 'Failed to change password.');
        } finally {
            setPasswordSaving(false);
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage your account</p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                {/* Tab sidebar */}
                <div style={{ width: '180px', flexShrink: 0 }}>
                    <div className="card">
                        <div style={{ padding: 'var(--space-2)' }}>
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center',
                                        gap: 'var(--space-2)', padding: 'var(--space-3)',
                                        borderRadius: 'var(--radius-lg)', border: 'none',
                                        cursor: 'pointer', fontSize: 'var(--font-size-sm)',
                                        fontWeight: 'var(--font-weight-medium)',
                                        background: activeTab === tab.id ? 'var(--color-primary-50)' : 'transparent',
                                        color: activeTab === tab.id ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    <tab.icon size={16} /> {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                                    <div className="avatar avatar-xl avatar-gradient" style={{ fontSize: 'var(--font-size-2xl)' }}>
                                        {(name || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{user?.name}</div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>{user?.email}</div>
                                    </div>
                                </div>

                                {profileMsg && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-success-50)', border: '1px solid var(--color-success-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-success-700)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                                        <CheckCircle size={16} /> {profileMsg}
                                    </div>
                                )}
                                {profileError && (
                                    <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-50)', border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                                        {profileError}
                                    </div>
                                )}

                                <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                                    <div className="form-group">
                                        <label className="form-label">Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: '44px' }} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Email Address <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 'var(--font-size-xs)' }}>(cannot be changed)</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="email" className="form-input" value={user?.email || ''} style={{ paddingLeft: '44px', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }} readOnly />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Company Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <Building2 size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                            <input type="text" className="form-input" value={company} onChange={e => setCompany(e.target.value)} placeholder="Your agency name" style={{ paddingLeft: '44px' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <button type="submit" className="btn btn-primary" disabled={profileSaving}>
                                            {profileSaving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div className="card animate-fade-in">
                            <div className="card-header">
                                <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                                    Change Password
                                </h2>
                            </div>
                            <div className="card-body">
                                {passwordMsg && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-success-50)', border: '1px solid var(--color-success-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-success-700)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                                        <CheckCircle size={16} /> {passwordMsg}
                                    </div>
                                )}
                                {passwordError && (
                                    <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-50)', border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                                        {passwordError}
                                    </div>
                                )}

                                <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '400px' }}>
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type={showCurrent ? 'text' : 'password'} className="form-input" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ paddingRight: '44px' }} required />
                                            <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <div style={{ position: 'relative' }}>
                                            <input type={showNew ? 'text' : 'password'} className="form-input" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" style={{ paddingRight: '44px' }} required />
                                            <button type="button" onClick={() => setShowNew(!showNew)}
                                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input type="password" className="form-input" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                                    </div>

                                    <div>
                                        <button type="submit" className="btn btn-primary" disabled={passwordSaving}>
                                            {passwordSaving ? 'Updating...' : <><Save size={16} /> Update Password</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}