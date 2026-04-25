import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiChangePassword } from '../../api/auth.js';
import { Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function ClientSettingsPage() {
    const { user } = useAuth();
    const [currentPassword,  setCurrentPassword]  = useState('');
    const [newPassword,      setNewPassword]       = useState('');
    const [confirmPassword,  setConfirmPassword]   = useState('');
    const [showCurrent,      setShowCurrent]       = useState(false);
    const [showNew,          setShowNew]           = useState(false);
    const [saving,           setSaving]            = useState(false);
    const [msg,              setMsg]               = useState('');
    const [error,            setError]             = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMsg(''); setError('');
        if (newPassword.length < 6) { setError('New password must be at least 6 characters.'); return; }
        if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
        setSaving(true);
        try {
            await apiChangePassword(currentPassword, newPassword);
            setMsg('Password changed successfully.');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            setError(err.message || 'Failed to change password.');
        } finally { setSaving(false); }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>Settings</h1>
                <p style={{ color: 'var(--text-tertiary)' }}>Manage your portal account</p>
            </div>

            {/* Profile info card */}
            <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <div className="avatar avatar-lg" style={{
                            background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white',
                            fontSize: 'var(--font-size-xl)'
                        }}>
                            {user?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-lg)' }}>{user?.name}</div>
                            <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>{user?.email}</div>
                            <div style={{ marginTop: 'var(--space-1)' }}>
                                <span style={{ fontSize: 'var(--font-size-xs)', padding: '2px 10px', borderRadius: 'var(--radius-full)', background: 'var(--color-success-100)', color: 'var(--color-success-700)', fontWeight: 'var(--font-weight-medium)' }}>
                                    Client Account
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change password */}
            <div className="card">
                <div className="card-header">
                    <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Lock size={18} /> Change Password
                    </h2>
                </div>
                <div className="card-body">
                    {msg && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', background: 'var(--color-success-50)', border: '1px solid var(--color-success-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-success-700)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                            <CheckCircle size={16} /> {msg}
                        </div>
                    )}
                    {error && (
                        <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-50)', border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className="form-group">
                            <label className="form-label">Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <input className="form-input" type={showCurrent ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required style={{ paddingRight: '44px' }} />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input className="form-input" type={showNew ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters" required style={{ paddingRight: '44px' }} />
                                <button type="button" onClick={() => setShowNew(!showNew)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Confirm New Password</label>
                            <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary" disabled={saving}>
                                {saving ? 'Updating...' : <><Save size={16} /> Update Password</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}