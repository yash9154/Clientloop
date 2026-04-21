import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Building2, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setIsLoading(true);
        try {
            await signup(form.email, form.password, form.name, form.company);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'
        }}>
            {/* Left branding */}
            <div className="md:hidden" style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                justifyContent: 'center', padding: 'var(--space-16)', color: 'white'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-16)' }}>
                    <div style={{
                        width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)',
                        borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>ClientLoop</span>
                </Link>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 'var(--font-weight-extrabold)', lineHeight: 1.1, marginBottom: 'var(--space-6)' }}>
                    Start your<br />
                    <span style={{ color: 'var(--color-primary-300)' }}>free account</span>
                </h1>
                <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.8, maxWidth: '400px', lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-8)' }}>
                    Manage clients, post updates, and get approvals — all in one place.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {['No credit card required', 'Set up in under 2 minutes', 'Add unlimited clients'].map((b, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <CheckCircle size={20} style={{ color: 'var(--color-success-400)' }} />
                            <span>{b}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right form */}
            <div style={{
                width: '100%', maxWidth: '480px',
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: 'var(--space-8)', background: 'white',
                borderRadius: 'var(--radius-2xl) 0 0 var(--radius-2xl)', overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>ClientLoop</span>
                </div>

                <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                    Create your account
                </h2>
                <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-6)' }}>
                    Start managing your clients professionally
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
                        <label className="form-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" className="form-input" placeholder="Your name" value={form.name} onChange={set('name')} style={{ paddingLeft: '44px' }} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Company Name <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                        <div style={{ position: 'relative' }}>
                            <Building2 size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="text" className="form-input" placeholder="Your agency name" value={form.company} onChange={set('company')} style={{ paddingLeft: '44px' }} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input type="email" className="form-input" placeholder="you@agency.com" value={form.email} onChange={set('email')} style={{ paddingLeft: '44px' }} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input" placeholder="At least 6 characters"
                                value={form.password} onChange={set('password')}
                                style={{ paddingLeft: '44px', paddingRight: '44px' }} required minLength={6}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={isLoading}
                        style={{ padding: 'var(--space-4)', fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)' }}>
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                    </button>
                </form>

                <p style={{ marginTop: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                    By creating an account you agree to our{' '}
                    <a href="#" style={{ color: 'var(--color-primary-600)' }}>Terms of Service</a>
                </p>
                <p style={{ marginTop: 'var(--space-5)', textAlign: 'center', fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)' }}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}