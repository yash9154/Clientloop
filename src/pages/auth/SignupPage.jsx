import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, Building2, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup, loginWithGoogle, error: authError, clearError } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
        if (authError) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        clearError();

        // Basic validation
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            await signup(
                formData.email,
                formData.password,
                formData.name,
                'agency', // Default role
                formData.company
            );
            // Navigate to dashboard after successful signup
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        setError('');
        clearError();
        setIsGoogleLoading(true);

        try {
            const { isNewUser } = await loginWithGoogle();
            // Navigate to dashboard regardless of new/existing user
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Google sign-up failed');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    const displayError = error || authError;

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
                    Start your<br />
                    <span style={{ color: 'var(--color-primary-300)' }}>free trial</span>
                </h1>

                <p style={{
                    fontSize: 'var(--font-size-lg)',
                    opacity: 0.8,
                    maxWidth: '400px',
                    lineHeight: 'var(--line-height-relaxed)',
                    marginBottom: 'var(--space-8)'
                }}>
                    Join 5,000+ agencies using ClientLoop to deliver a professional client experience.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                    {[
                        'Free forever for 1 client',
                        'No credit card required',
                        'Setup in 2 minutes'
                    ].map((benefit, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <CheckCircle size={20} style={{ color: 'var(--color-success-400)' }} />
                            <span>{benefit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Side - Signup Form */}
            <div style={{
                width: '100%',
                maxWidth: '520px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: 'var(--space-8)',
                background: 'white',
                borderRadius: 'var(--radius-2xl) 0 0 var(--radius-2xl)',
                overflowY: 'auto'
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
                    Create your account
                </h2>
                <p style={{
                    color: 'var(--text-tertiary)',
                    marginBottom: 'var(--space-6)'
                }}>
                    Start managing your clients professionally
                </p>

                {displayError && (
                    <div style={{
                        padding: 'var(--space-3) var(--space-4)',
                        background: 'var(--color-error-50)',
                        border: '1px solid var(--color-error-200)',
                        borderRadius: 'var(--radius-lg)',
                        color: 'var(--color-error-600)',
                        fontSize: 'var(--font-size-sm)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        {displayError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
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
                                name="name"
                                className="form-input"
                                placeholder="Sarah Mitchell"
                                value={formData.name}
                                onChange={handleChange}
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                        <label className="form-label">Company Name (Optional)</label>
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
                                name="company"
                                className="form-input"
                                placeholder="Your Agency Name"
                                value={formData.company}
                                onChange={handleChange}
                                style={{ paddingLeft: '44px' }}
                            />
                        </div>
                    </div>

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
                                name="email"
                                className="form-input"
                                placeholder="you@agency.com"
                                value={formData.email}
                                onChange={handleChange}
                                style={{ paddingLeft: '44px' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
                        <label className="form-label">Password</label>
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
                                name="password"
                                className="form-input"
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ paddingLeft: '44px', paddingRight: '44px' }}
                                required
                                minLength={6}
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
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                            Must be at least 6 characters
                        </p>
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
                                Create Account
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
                    onClick={handleGoogleSignup}
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
                    marginTop: 'var(--space-6)',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                    lineHeight: 'var(--line-height-relaxed)'
                }}>
                    By creating an account, you agree to our{' '}
                    <a href="#" style={{ color: 'var(--color-primary-600)' }}>Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" style={{ color: 'var(--color-primary-600)' }}>Privacy Policy</a>
                </p>

                <p style={{
                    marginTop: 'var(--space-6)',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)'
                }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
