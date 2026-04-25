import { Link } from 'react-router-dom';
import {
    ArrowRight, Users, FolderOpen, FileText,
    ThumbsUp, StickyNote, Calendar, Shield,
    MessageSquare, Bell, Paperclip, CheckCircle2
} from 'lucide-react';

const features = [
    { icon: Users,         title: 'Client Management',    description: 'Add clients, auto-generate their portal login credentials, track status — active, lead, or inactive.' },
    { icon: FolderOpen,    title: 'Project Tracking',     description: 'Create projects per client. Track status as In Progress, In Review, or Completed.' },
    { icon: FileText,      title: 'Project Updates',      description: 'Post rich updates with file attachments — images, PDFs, Word, Excel, video and more.' },
    { icon: ThumbsUp,      title: 'Approval Workflows',   description: 'Request client approval on deliverables. They approve or request changes with a note — all tracked.' },
    { icon: MessageSquare, title: 'Comments & Discussion', description: 'Both agency and client can comment on any update. Keeps all feedback contextual and organised.' },
    { icon: StickyNote,    title: 'Activity Timeline',    description: 'Log calls, emails, meetings and proposals per client. Build a full history of every relationship.' },
    { icon: Calendar,      title: 'Follow-up Reminders',  description: 'Set follow-up dates per client. Dashboard shows overdue ones so nothing falls through the cracks.' },
    { icon: Bell,          title: 'Notifications',        description: 'In-app notification bell plus email alerts — clients notified when updates are posted, agency notified on approvals.' },
    { icon: Paperclip,     title: 'File Uploads',         description: 'Upload files directly to updates via Cloudinary CDN. Clients download with one click.' },
    { icon: Shield,        title: 'Secure Client Portal', description: 'Clients get their own login. They only see their projects and updates — nothing else.' },
];

const steps = [
    { n: '1', title: 'Create your account',    desc: 'Sign up as an agency in under a minute.' },
    { n: '2', title: 'Add your clients',        desc: 'Add clients — ClientLoop auto-creates their portal login and sends welcome email with credentials.' },
    { n: '3', title: 'Create projects',         desc: 'Create projects for each client and start posting updates with files attached.' },
    { n: '4', title: 'Client approves',         desc: 'Client logs into their portal, reviews updates, approves or requests changes. You get notified instantly.' },
];

function Navbar() {
    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, height: '68px',
            background: 'rgba(255,255,255,0.94)', backdropFilter: 'blur(12px)',
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
                    Client Portal
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
            <div style={{ position: 'absolute', top: '15%', left: '5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 var(--space-6)', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                <div className="animate-fade-in-down" style={{
                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                    background: 'white', padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)',
                    boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--space-6)'
                }}>
                    🚀 Client Portal for Agencies & Freelancers
                </div>

                <h1 className="animate-fade-in-up" style={{
                    fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
                    fontWeight: 'var(--font-weight-extrabold)', lineHeight: 1.1,
                    marginBottom: 'var(--space-6)', color: 'var(--text-primary)'
                }}>
                    One portal for all your<br />
                    <span style={{ background: 'linear-gradient(135deg, var(--color-primary-500), #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        client communications.
                    </span>
                </h1>

                <p className="animate-fade-in-up" style={{
                    fontSize: 'var(--font-size-xl)', color: 'var(--text-secondary)',
                    marginBottom: 'var(--space-8)', lineHeight: 'var(--line-height-relaxed)',
                    maxWidth: '620px', margin: '0 auto var(--space-8)',
                    animationDelay: '0.1s'
                }}>
                    Replace scattered WhatsApp messages, email chains and Google Drive links
                    with a clean, professional portal your clients will love.
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
                        boxShadow: '0 25px 80px -12px rgba(0,0,0,0.18)',
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
                        {/* App preview */}
                        <div style={{ display: 'flex', minHeight: '300px' }}>
                            <div style={{ width: '200px', background: 'linear-gradient(180deg,#1e1b4b,#312e81)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }} className="md:hidden">
                                <div style={{ color: 'white', fontWeight: 'var(--font-weight-bold)', padding: 'var(--space-2)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>ClientLoop</div>
                                {[['Dashboard','active'],['Clients',''],['Projects',''],['Settings','']].map(([item, active]) => (
                                    <div key={item} style={{ padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', background: active ? 'rgba(255,255,255,0.15)' : 'transparent', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--font-size-xs)' }}>{item}</div>
                                ))}
                            </div>
                            <div style={{ flex: 1, padding: 'var(--space-5)', background: 'var(--bg-secondary)' }}>
                                <div style={{ fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>Welcome back! 👋</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    {[['Clients','8','#6366f1'],['Projects','12','#3b82f6'],['In Progress','5','#f59e0b'],['Completed','7','#10b981']].map(([l,v,c])=>(
                                        <div key={l} style={{ background: 'white', padding: 'var(--space-3)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                                            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '4px' }}>{l}</div>
                                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: c }}>{v}</div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: 'var(--space-4)' }}>
                                    <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-xs)' }}>Recent Clients</div>
                                    {[['Acme Inc.','#6366f1','active'],['Beta Corp','#10b981','lead'],['Gamma LLC','#f59e0b','active']].map(([name,c,status],i)=>(
                                        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: i<2?'1px solid var(--border-light)':'none' }}>
                                            <div style={{ width: '28px', height: '28px', background: c, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px', fontWeight: 'bold' }}>{name[0]}</div>
                                            <div style={{ flex: 1 }}><div style={{ fontSize: '12px', fontWeight: '500' }}>{name}</div></div>
                                            <div style={{ fontSize: '10px', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: status==='active'?'#d1fae5':'#dbeafe', color: status==='active'?'#047857':'#1d4ed8', textTransform: 'capitalize' }}>{status}</div>
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
        <section style={{ padding: '80px var(--space-6)', background: 'white' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', maxWidth: '580px', margin: '0 auto var(--space-16)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
                        Everything you need.<br />
                        <span style={{ color: 'var(--color-primary-500)' }}>Nothing you don't.</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                        Focused on making agency-client communication clean, professional and trackable.
                    </p>
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-8">
                    {features.map((f, i) => (
                        <div key={f.title} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.06}s` }}>
                            <div style={{ width: '48px', height: '48px', marginBottom: 'var(--space-4)', background: 'var(--color-primary-100)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-600)' }}>
                                <f.icon size={24} />
                            </div>
                            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>{f.title}</h3>
                            <p style={{ color: 'var(--text-tertiary)', lineHeight: 'var(--line-height-relaxed)', fontSize: 'var(--font-size-sm)' }}>{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section style={{ padding: '80px var(--space-6)', background: 'var(--bg-secondary)' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>How it works</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>Set up in minutes. Works from day one.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'var(--space-6)' }} className="md:grid-cols-1">
                    {steps.map((s, i) => (
                        <div key={s.n} className="animate-fade-in-up" style={{ textAlign: 'center', animationDelay: `${i * 0.1}s` }}>
                            <div style={{ width: '52px', height: '52px', margin: '0 auto var(--space-4)', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
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

function TwoPortals() {
    return (
        <section style={{ padding: '80px var(--space-6)', background: 'white' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>Two portals, one platform</h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>Different views for agency and client. Everyone sees exactly what they need.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }} className="md:grid-cols-1">
                    {[
                        {
                            title: 'Agency Dashboard',
                            color: '#4f46e5',
                            bg: '#eef2ff',
                            items: ['Manage all clients and projects', 'Post updates with file attachments', 'Track approval status per update', 'Log notes and follow-ups per client', 'Get notified when client approves or comments', 'View all projects across all clients']
                        },
                        {
                            title: 'Client Portal',
                            color: '#059669',
                            bg: '#ecfdf5',
                            items: ['See only their own projects', 'View all updates from their agency', 'Download attached files', 'Approve updates or request changes', 'Leave comments and discuss updates', 'Get email alerts on new updates']
                        }
                    ].map(portal => (
                        <div key={portal.title} style={{ background: portal.bg, borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', border: `2px solid ${portal.color}20` }}>
                            <h3 style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-xl)', color: portal.color, marginBottom: 'var(--space-5)' }}>{portal.title}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {portal.items.map(item => (
                                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                                        <CheckCircle2 size={16} style={{ color: portal.color, flexShrink: 0, marginTop: '2px' }} />
                                        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section style={{ padding: '80px var(--space-6)', background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4338ca 100%)', color: 'white', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-4)' }}>
                    Ready to get started?
                </h2>
                <p style={{ fontSize: 'var(--font-size-lg)', opacity: 0.85, marginBottom: 'var(--space-8)' }}>
                    Create your account and add your first client in under 2 minutes.
                </p>
                <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/signup" className="btn btn-lg" style={{ background: 'white', color: 'var(--color-primary-600)', padding: 'var(--space-4) var(--space-10)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Create Free Account <ArrowRight size={20} />
                    </Link>
                    <Link to="/client-login" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: 'var(--space-4) var(--space-8)', fontSize: 'var(--font-size-lg)' }}>
                        Client Login
                    </Link>
                </div>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer style={{ padding: 'var(--space-8) var(--space-6)', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="3" />
                        </svg>
                    </div>
                    <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-sm)' }}>ClientLoop</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
                    <Link to="/login"        style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Agency Login</Link>
                    <Link to="/client-login" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Client Portal</Link>
                    <Link to="/signup"       style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary-600)', fontWeight: 'var(--font-weight-medium)' }}>Sign Up Free</Link>
                </div>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>© 2026 ClientLoop. All rights reserved.</p>
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
            <TwoPortals />
            <CTA />
            <Footer />
        </div>
    );
}