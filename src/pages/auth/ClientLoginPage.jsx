import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function ClientLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(email, password, true);
            navigate('/client');
        } catch (err) {
            if (err.status === 0) {
                setError('Cannot connect to server. Please try again later.');
            } else {
                setError(err.message || 'Invalid email or password.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, #e0e7ff 100%)',
            padding: 'var(--space-4)'
        }}>
            <div style={{
                width: '100%', maxWidth: '440px',
                background: 'white', borderRadius: 'var(--radius-2xl)',
                boxShadow: 'var(--shadow-xl)', padding: 'var(--space-8)',
                animation: 'fadeInUp 0.4s ease'
            }}>
                {/* Logo */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: 'white', marginBottom: 'var(--space-3)'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>ClientLoop</span>
                </div>

                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', marginBottom: 'var(--space-1)' }}>
                    Client Portal
                </h2>
                <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', marginBottom: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>
                    View your project updates and approve deliverables
                </p>

                {error && (
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)', marginBottom: 'var(--space-4)',
                        background: 'var(--color-error-50)', border: '1px solid var(--color-error-200)',
                        borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" className="form-input" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: '44px' }} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input" placeholder="Your password"
                                value={password} onChange={e => setPassword(e.target.value)}
                                style={{ paddingLeft: '44px', paddingRight: '44px' }} required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}
                        style={{ padding: 'var(--space-4)', fontSize: 'var(--font-size-base)' }}>
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Access Portal <ArrowRight size={18} /></>}
                    </button>
                </form>

                <p style={{ marginTop: 'var(--space-5)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                    Your login credentials were shared by your agency.
                </p>

                <div style={{ marginTop: 'var(--space-5)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <Link to="/login" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        Agency login →
                    </Link>
                </div>
            </div>
        </div>
    );
}