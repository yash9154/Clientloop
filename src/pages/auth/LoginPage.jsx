import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('demo@agency.com');
    const [password, setPassword] = useState('password');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            // Show detailed error message
            if (err.status === 0) {
                setError('⚠️ Cannot connect to server. Make sure the backend is running on port 5000');
            } else if (err.status === 401) {
                setError('Invalid email or password');
            } else if (err.status === 403) {
                setError(err.message || 'Please use the correct login portal');
            } else {
                setError(err.message || 'Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setIsGoogleLoading(true);

        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (err) {
            console.error('Google login error:', err);
            setError(err.message || 'Google login failed');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)'
        }}>
            {/* Left Side - Branding */}
            <div className="md:hidden" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--space-16)',
                color: 'white'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-16)' }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-xl)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                            <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)' }}>
                        ClientLoop
                    </span>
                </Link>

                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 'var(--font-weight-extrabold)',
                    lineHeight: '1.1',
                    marginBottom: 'var(--space-6)'
                }}>
                    Your clients deserve<br />
                    <span style={{ color: 'var(--color-primary-300)' }}>clarity.</span>
                </h1>

                <p style={{
                    fontSize: 'var(--font-size-lg)',
                    opacity: 0.8,
                    maxWidth: '400px',
                    lineHeight: 'var(--line-height-relaxed)'
                }}>
                    Share updates, files, and approvals with clients in one clean, professional portal.
                </p>

                <div style={{ marginTop: 'var(--space-12)', display: 'flex', gap: 'var(--space-8)' }}>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>5K+</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.7 }}>Agencies</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>50K+</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.7 }}>Projects</div>
                    </div>
                    <div>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)' }}>99%</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.7 }}>Satisfaction</div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{
                width: '100%',
                maxWidth: '520px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--space-8)',
                background: 'white',
                borderRadius: 'var(--radius-2xl) 0 0 var(--radius-2xl)'
            }}>
                <div className="md:flex" style={{
                    display: 'none',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    marginBottom: 'var(--space-8)'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                        ClientLoop
                    </span>
                </div>

                <h2 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--space-2)'
                }}>
                    Welcome back
                </h2>
                <p style={{
                    color: 'var(--text-tertiary)',
                    marginBottom: 'var(--space-8)'
                }}>
                    Sign in to your agency account
                </p>

                {error && (
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--color-error-50)',
                        border: '1px solid var(--color-error-200)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--color-error-600)',
                        fontSize: 'var(--font-size-sm)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="form-label">Email address</label>
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
                                placeholder="you@agency.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label className="form-label">Password</label>
                            <a href="#" style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--color-primary-600)'
                            }}>
                                Forgot password?
                            </a>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{
                                position: 'absolute',
                                left: '14px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-muted)'
                            }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-muted)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '0'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary w-full"
                        disabled={isLoading}
                        style={{ padding: 'var(--space-4)', fontSize: 'var(--font-size-base)' }}
                    >
                        {isLoading ? (
                            <Loader2 size={20} className="animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    margin: 'var(--space-6) 0'
                }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)' }}>or</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
                </div>

                <button
                    type="button"
                    className="btn btn-secondary w-full"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                    style={{ padding: 'var(--space-3) var(--space-4)' }}
                >
                    {isGoogleLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <>
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </>
                    )}
                </button>

                <p style={{
                    marginTop: 'var(--space-8)',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)'
                }}>
                    Don't have an account?{' '}
                    <Link to="/" style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)' }}>
                        Start free trial
                    </Link>
                </p>

                <p style={{
                    marginTop: 'var(--space-4)',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)'
                }}>
                    Are you a client?{' '}
                    <Link to="/client-login" style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)' }}>
                        Client portal login
                    </Link>
                </p>
            </div>
        </div>
    );
}
