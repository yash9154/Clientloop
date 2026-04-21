import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, FileText, ThumbsUp, StickyNote, Calendar, Shield } from 'lucide-react';

const features = [
    { icon: Users,       title: 'Client Management',   description: 'Add and manage all your clients in one place. Track status, contact info, and follow-up dates.' },
    { icon: FileText,    title: 'Project Updates',      description: 'Post progress updates directly to your clients. Keep everyone informed without email chains.' },
    { icon: ThumbsUp,    title: 'Approval Workflows',   description: 'Request approvals on deliverables. Clients approve or request changes with one click.' },
    { icon: StickyNote,  title: 'Activity Timeline',    description: 'Log calls, emails, and meetings per client. Build a full history of every relationship.' },
    { icon: Calendar,    title: 'Follow-up Reminders',  description: 'Set follow-up dates for clients. Dashboard highlights overdue follow-ups so nothing slips.' },
    { icon: Shield,      title: 'Client Portal',        description: 'Clients get their own secure login. They only see their updates — nothing else.' },
];

function Navbar() {
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '68px',
            background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 var(--space-8)', zIndex: 1000
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                    width: '38px', height: '38px',
                    background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                    borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                    </svg>
                </div>
                <span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                    ClientLoop
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Link to="/client-login" className="btn btn-ghost" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                    Client Login
                </Link>
                <Link to="/login" className="btn btn-ghost" style={{ fontSize: 'var(--font-size-sm)' }}>
                    Agency Login
                </Link>
                <Link to="/signup" className="btn btn-primary">
                    Get Started <ArrowRight size={16} />
                </Link>
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section style={{
            paddingTop: 'calc(68px + 80px)', paddingBottom: '80px',
            background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 60%, #e0e7ff 100%)',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Glow blobs */}
            <div style={{ position: 'absolute', top: '15%', left: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 var(--space-6)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div className="animate-fade-in-down" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    background: 'white', padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)',
                    boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-6)'
                }}>
                    🚀 Client Portal for Agencies
                </div>

                <h1 className="animate-fade-in-up" style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                    fontWeight: 'var(--font-weight-extrabold)', lineHeight: 1.1,
                    marginBottom: 'var(--space-6)', color: 'var(--text-primary)'
                }}>
                    One portal for all your<br />
                    <span style={{
                        background: 'linear-gradient(135deg, var(--color-primary-500), #8b5cf6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>
                        client communications.
                    </span>
                </h1>

                <p className="animate-fade-in-up" style={{
                    fontSize: 'var(--font-size-xl)', color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-8)', lineHeight: 'var(--line-height-relaxed)',
                    maxWidth: '620px', margin: '0 auto var(--space-8)',
                    animationDelay: '0.1s'
                }}>
                    Replace scattered WhatsApp messages and email chains with a clean,
                    professional portal your clients will actually love.
                </p>

                <div className="animate-fade-in-up" style={{
                    display: 'flex', gap: 'var(--space-4)', justifyContent: 'center',
                    flexWrap: 'wrap', marginBottom: 'var(--space-6)', animationDelay: '0.2s'
                }}>
                    <Link to="/signup" className="btn btn-primary btn-lg" style={{
                        padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--font-size-lg)',
                        boxShadow: '0 4px 20px rgba(99,102,241,0.35)'
                    }}>
                        Create Free Account <ArrowRight size={20} />
                    </Link>
                    <Link to="/client-login" className="btn btn-secondary btn-lg" style={{ padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--font-size-lg)' }}>
                        Client Portal Login
                    </Link>
                </div>

                <p className="animate-fade-in-up" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-muted)', animationDelay: '0.3s' }}>
                    Free to use · No credit card required
                </p>

                {/* Dashboard mockup */}
                <div className="animate-fade-in-up" style={{ marginTop: '60px', animationDelay: '0.4s' }}>
                    <div style={{
                        background: 'white', borderRadius: 'var(--radius-2xl)',
                        boxShadow: '0 25px 80px -12px rgba(0,0,0,0.2)',
                        border: '1px solid var(--border-light)', overflow: 'hidden'
                    }}>
                        {/* Browser bar */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3) var(--space-4)', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {['#ff5f57','#febc2e','#28c840'].map(c => <div key={c} style={{ width: '11px', height: '11px', borderRadius: '50%', background: c }} />)}
                            </div>
                            <div style={{ flex: 1, background: 'white', borderRadius: 'var(--radius-md)', padding: '4px 12px', fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textAlign: 'center' }}>
                                clientloop.app/dashboard
                            </div>
                        </div>
                        {/* Content */}
                        <div style={{ display: 'flex', minHeight: '320px' }}>
                            {/* Sidebar */}
                            <div style={{ width: '200px', background: 'linear-gradient(180deg, #1e1b4b, #312e81)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} className="md:hidden">
                                <div style={{ color: 'white', fontWeight: 'var(--font-weight-bold)', padding: 'var(--space-2)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>ClientLoop</div>
                                {['Dashboard', 'Clients', 'Settings'].map((item, i) => (
                                    <div key={item} style={{
                                        padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)',
                                        background: i === 0 ? 'rgba(255,255,255,0.15)' : 'transparent',
                                        color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-xs)'
                                    }}>{item}</div>
                                ))}
                            </div>
                            {/* Main */}
                            <div style={{ flex: 1, padding: 'var(--space-5)', background: 'var(--bg-secondary)' }}>
                                <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>Welcome back! 👋</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    {[['Total Clients','8','#6366f1'],['Active','6','#10b981'],['Leads','2','#3b82f6'],['Follow-ups Due','3','#f59e0b']].map(([l,v,c]) => (
                                        <div key={l} style={{ background: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                                            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{l}</div>
                                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: c }}>{v}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: 'var(--space-4)' }}>
                                    <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>Recent Clients</div>
                                    {['Acme Inc.','Beta Corp','Gamma LLC'].map((name, i) => (
                                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                                            <div style={{ width: '28px', height: '28px', background: ['#6366f1','#10b981','#f59e0b'][i], borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{name[0]}</div>
                                            <div style={{ flex: 1, height: '8px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)', width: `${70 - i * 10}%` }} />
                                            <div style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: ['#d1fae5','#dbeafe','#fef3c7'][i], color: ['#047857','#1d4ed8','#b45309'][i] }}>
                                                {['active','lead','active'][i]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="features" style={{ padding: '80px var(--space-6)', background: 'white' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto var(--space-16)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
                        Everything you need.<br />
                        <span style={{ color: 'var(--color-primary-500)' }}>Nothing you don't.</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                        Focused on one thing: making agency-client communication clean and professional.
                    </p>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-8">
                    {features.map((f, i) => (
                        <div key={f.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                            <div style={{
                                width: '52px', height: '52px', marginBottom: 'var(--space-4)',
                                background: 'var(--color-primary-100)', borderRadius: 'var(--radius-xl)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--color-primary-600)'
                            }}>
                                <f.icon size={26} />
                            </div>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
                                {f.title}
                            </h3>
                            <p style={{ color: 'var(--text-tertiary)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--font-size-sm)' }}>
                                {f.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    const steps = [
        { n: '1', title: 'Create your account',   desc: 'Sign up as an agency in seconds. No credit card needed.' },
        { n: '2', title: 'Add your clients',       desc: 'Add clients with their details. ClientLoop auto-creates their portal login.' },
        { n: '3', title: 'Post updates',           desc: 'Share progress, milestones, and deliverables directly with each client.' },
        { n: '4', title: 'Get approvals',          desc: 'Clients log in, review updates, and approve or request changes instantly.' },
    ];

    return (
        <section style={{ padding: '80px var(--space-6)', background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
                        How it works
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                        Get set up in minutes.
                    </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)' }} className="md:grid-cols-1">
                    {steps.map((s, i) => (
                        <div key={s.n} className="animate-fade-in-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                            <div style={{
                                width: '56px', height: '56px', margin: '0 auto var(--space-4)',
                                background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)'
                            }}>
                                {s.n}
                            </div>
                            <h3 style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)', fontSize: 'var(--font-size-base)' }}>{s.title}</h3>
                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)', lineHeight: 'var(--line-height-relaxed)' }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section style={{
            padding: '80px var(--space-6)',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            color: 'white', textAlign: 'center'
        }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
                    Ready to get started?
                </h2>
                <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.85, marginBottom: 'var(--space-8)' }}>
                    Create your account and add your first client in under 2 minutes.
                </p>
                <Link to="/signup" className="btn btn-lg" style={{
                    background: 'white', color: 'var(--color-primary-600)',
                    padding: 'var(--space-4) var(--space-10)', fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)'
                }}>
                    Create Free Account <ArrowRight size={20} />
                </Link>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer style={{ padding: 'var(--space-8) var(--space-6)', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{
                        width: '30px', height: '30px',
                        background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))',
                        borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)' }}>ClientLoop</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                    <Link to="/login" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Agency Login</Link>
                    <Link to="/client-login" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Client Portal</Link>
                    <Link to="/signup" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)' }}>Sign Up</Link>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>© 2026 ClientLoop. Built as a college project.</p>
            </div>
        </footer>
    );
}

export default function LandingPage() {
    return (
        <div>
            <Navbar />
            <Hero />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </div>
    );
}