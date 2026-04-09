import { Link } from 'react-router-dom';
import {
    ArrowRight,
    Check,
    Users,
    FileText,
    CheckCircle2,
    MessageSquare,
    Shield,
    Zap,
    Star,
    ChevronRight
} from 'lucide-react';

const features = [
    {
        icon: FileText,
        title: 'Project Updates',
        description: 'Share detailed updates with attachments. Keep clients informed without endless email chains.'
    },
    {
        icon: CheckCircle2,
        title: 'Easy Approvals',
        description: 'One-click approvals for clients. Clear status visibility so everyone knows what\'s next.'
    },
    {
        icon: MessageSquare,
        title: 'Contextual Comments',
        description: 'Keep discussions tied to updates. No more digging through emails to find feedback.'
    },
    {
        icon: Shield,
        title: 'Client Privacy',
        description: 'Clients only see their projects. Your internal work stays completely private.'
    },
    {
        icon: Zap,
        title: 'Instant Notifications',
        description: 'Email alerts for new updates, approvals, and comments. Nobody misses important news.'
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Multiple team members can post updates. Unified experience for your clients.'
    }
];

const testimonials = [
    {
        quote: "ClientLoop transformed how we work with clients. No more 'Any update?' emails. Our clients love the clarity.",
        author: "Sarah Chen",
        role: "Founder, Pixel Perfect Studio",
        avatar: "SC"
    },
    {
        quote: "We used to give clients ClickUp access. It was chaos. ClientLoop gives them exactly what they need - nothing more.",
        author: "Marcus Johnson",
        role: "Creative Director, Bold Agency",
        avatar: "MJ"
    },
    {
        quote: "The approval workflow is a game-changer. We cut our feedback collection time by 60%.",
        author: "Emily Rodriguez",
        role: "Operations Lead, Spark Digital",
        avatar: "ER"
    }
];

const plans = [
    {
        name: 'Free',
        price: 0,
        period: 'forever',
        description: 'Perfect for trying out ClientLoop',
        features: ['1 client', '3 projects', 'Basic updates', 'File sharing (50MB)'],
        cta: 'Get Started',
        highlighted: false
    },
    {
        name: 'Starter',
        price: 19,
        period: 'month',
        description: 'Great for freelancers',
        features: ['Up to 5 clients', 'Unlimited projects', 'Approval workflows', 'File sharing (5GB)', 'Priority support'],
        cta: 'Start Free Trial',
        highlighted: false
    },
    {
        name: 'Agency',
        price: 49,
        period: 'month',
        description: 'For growing agencies',
        features: ['Unlimited clients', 'Unlimited projects', 'Advanced workflows', 'File sharing (50GB)', 'Team members (10)', 'Custom branding'],
        cta: 'Start Free Trial',
        highlighted: true
    }
];

function Navbar() {
    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '72px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-8)',
            zIndex: 1000
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
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
                        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
                    </svg>
                </div>
                <span style={{
                    fontSize: 'var(--font-size-xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--text-primary)'
                }}>
                    ClientLoop
                </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }} className="md:hidden">
                <a href="#features" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Features</a>
                <a href="#pricing" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Pricing</a>
                <a href="#testimonials" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Testimonials</a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <Link to="/client-login" className="btn btn-ghost" style={{ color: 'var(--text-secondary)' }}>Client Login</Link>
                <div style={{ width: '1px', height: '20px', background: 'var(--border-light)' }} className="hidden md:block" />
                <Link to="/login" className="btn btn-ghost">Agency Login</Link>
                <Link to="/signup" className="btn btn-primary hidden md:flex">
                    Start Free
                    <ArrowRight size={16} />
                </Link>
            </div>
        </nav>
    );
}

function Hero() {
    return (
        <section style={{
            paddingTop: 'calc(72px + var(--space-20))',
            paddingBottom: 'var(--space-20)',
            background: 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 50%, #e0e7ff 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }} />
            <div style={{
                position: 'absolute',
                bottom: '10%',
                right: '10%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(60px)'
            }} />

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-6)', position: 'relative', zIndex: 1 }}>
                <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                    <div className="animate-fade-in-down" style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        background: 'white',
                        padding: 'var(--space-2) var(--space-4)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--color-primary-600)',
                        fontWeight: 'var(--font-weight-medium)',
                        boxShadow: 'var(--shadow-sm)',
                        marginBottom: 'var(--space-6)'
                    }}>
                        <Star size={14} fill="currentColor" />
                        Trusted by 5,000+ agencies worldwide
                    </div>

                    <h1 className="animate-fade-in-up" style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 'var(--font-weight-extrabold)',
                        lineHeight: 1.1,
                        marginBottom: 'var(--space-6)',
                        color: 'var(--text-primary)'
                    }}>
                        Your clients deserve
                        <br />
                        <span style={{
                            background: 'linear-gradient(135deg, var(--color-primary-500) 0%, #8b5cf6 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            clarity, not chaos.
                        </span>
                    </h1>

                    <p className="animate-fade-in-up" style={{
                        fontSize: 'var(--font-size-xl)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--space-8)',
                        lineHeight: 'var(--line-height-relaxed)',
                        animationDelay: '0.1s'
                    }}>
                        Stop sharing project updates via WhatsApp, email, or messy Google Docs.
                        <br className="md:hidden" />
                        Give clients a clean, professional portal they'll love.
                    </p>

                    <div className="animate-fade-in-up" style={{
                        display: 'flex',
                        gap: 'var(--space-4)',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        marginBottom: 'var(--space-8)',
                        animationDelay: '0.2s'
                    }}>
                        <Link to="/signup" className="btn btn-primary btn-lg" style={{
                            padding: 'var(--space-4) var(--space-8)',
                            fontSize: 'var(--font-size-lg)',
                            boxShadow: '0 4px 24px rgba(99, 102, 241, 0.4)'
                        }}>
                            Start Free Trial
                            <ArrowRight size={20} />
                        </Link>
                        <a href="#demo" className="btn btn-secondary btn-lg" style={{
                            padding: 'var(--space-4) var(--space-8)',
                            fontSize: 'var(--font-size-lg)'
                        }}>
                            Watch Demo
                        </a>
                    </div>

                    <p className="animate-fade-in-up" style={{
                        fontSize: 'var(--font-size-sm)',
                        color: 'var(--text-muted)',
                        animationDelay: '0.3s'
                    }}>
                        Free forever for 1 client. No credit card required.
                    </p>
                </div>

                {/* Hero Image / Dashboard Preview */}
                <div className="animate-fade-in-up" style={{
                    marginTop: 'var(--space-16)',
                    position: 'relative',
                    animationDelay: '0.4s'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: 'var(--radius-2xl)',
                        boxShadow: '0 25px 100px -12px rgba(0, 0, 0, 0.25)',
                        border: '1px solid var(--border-light)',
                        overflow: 'hidden'
                    }}>
                        {/* Browser Chrome */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-4)',
                            background: 'var(--bg-secondary)',
                            borderBottom: '1px solid var(--border-light)'
                        }}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' }} />
                            </div>
                            <div style={{
                                flex: 1,
                                background: 'white',
                                borderRadius: 'var(--radius-md)',
                                padding: 'var(--space-2) var(--space-4)',
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--text-muted)',
                                textAlign: 'center'
                            }}>
                                app.clientloop.io
                            </div>
                        </div>

                        {/* Dashboard Preview */}
                        <div style={{ display: 'flex', minHeight: '400px' }}>
                            {/* Sidebar Preview */}
                            <div style={{
                                width: '220px',
                                background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
                                padding: 'var(--space-4)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--space-2)'
                            }} className="md:hidden">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                                    <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: 'var(--radius-md)' }} />
                                    <div style={{ color: 'white', fontWeight: 'var(--font-weight-bold)' }}>ClientLoop</div>
                                </div>
                                {['Dashboard', 'Clients', 'Projects', 'Billing'].map((item, i) => (
                                    <div key={item} style={{
                                        padding: 'var(--space-3)',
                                        borderRadius: 'var(--radius-md)',
                                        background: i === 0 ? 'rgba(255,255,255,0.15)' : 'transparent',
                                        color: 'rgba(255,255,255,0.8)',
                                        fontSize: 'var(--font-size-sm)'
                                    }}>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            {/* Main Content Preview */}
                            <div style={{ flex: 1, padding: 'var(--space-6)', background: 'var(--bg-secondary)' }}>
                                <div style={{ marginBottom: 'var(--space-6)' }}>
                                    <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                                        Welcome back, Sarah! 👋
                                    </div>
                                    <div style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                                        Here's what's happening with your projects today.
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }} className="md:grid-cols-2">
                                    {[
                                        { label: 'Total Clients', value: '12', color: 'var(--color-primary-500)' },
                                        { label: 'Active Projects', value: '28', color: 'var(--color-info-500)' },
                                        { label: 'Pending Approvals', value: '5', color: 'var(--color-warning-500)' },
                                        { label: 'Completed', value: '47', color: 'var(--color-success-500)' }
                                    ].map((stat) => (
                                        <div key={stat.label} style={{
                                            background: 'white',
                                            padding: 'var(--space-4)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border-light)'
                                        }}>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginBottom: 'var(--space-1)' }}>
                                                {stat.label}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: stat.color }}>
                                                {stat.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', padding: 'var(--space-4)' }}>
                                    <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-3)' }}>Recent Updates</div>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--space-3)',
                                            padding: 'var(--space-3) 0',
                                            borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none'
                                        }}>
                                            <div style={{ width: '36px', height: '36px', background: 'var(--color-primary-100)', borderRadius: 'var(--radius-full)' }} />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ height: '10px', width: `${70 - i * 10}%`, background: 'var(--color-gray-200)', borderRadius: 'var(--radius-sm)', marginBottom: '6px' }} />
                                                <div style={{ height: '8px', width: `${50 - i * 5}%`, background: 'var(--color-gray-100)', borderRadius: 'var(--radius-sm)' }} />
                                            </div>
                                            <span className="badge badge-pending" style={{ fontSize: '10px' }}>Pending</span>
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
        <section id="features" style={{
            padding: 'var(--space-24) var(--space-6)',
            background: 'white'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-16)' }}>
                    <h2 style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        Everything you need.
                        <br />
                        <span style={{ color: 'var(--color-primary-500)' }}>Nothing you don't.</span>
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                        ClientLoop is intentionally feature-limited. We focus on client communication,
                        not project management.
                    </p>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-8">
                    {features.map((feature, index) => (
                        <div key={feature.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'linear-gradient(135deg, var(--color-primary-100) 0%, var(--color-primary-50) 100%)',
                                borderRadius: 'var(--radius-xl)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 'var(--space-4)',
                                color: 'var(--color-primary-600)'
                            }}>
                                <feature.icon size={28} />
                            </div>
                            <h3 style={{
                                fontSize: 'var(--font-size-xl)',
                                fontWeight: 'var(--font-weight-semibold)',
                                marginBottom: 'var(--space-2)'
                            }}>
                                {feature.title}
                            </h3>
                            <p style={{ color: 'var(--text-tertiary)', lineHeight: 'var(--line-height-relaxed)' }}>
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Testimonials() {
    return (
        <section id="testimonials" style={{
            padding: 'var(--space-24) var(--space-6)',
            background: 'var(--bg-secondary)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
                    <h2 style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        Loved by agencies
                        <span style={{ color: 'var(--color-primary-500)' }}> worldwide</span>
                    </h2>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-1 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={testimonial.author}
                            className="card animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="card-body">
                                <div style={{ display: 'flex', gap: '2px', marginBottom: 'var(--space-4)' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={18} fill="#f59e0b" color="#f59e0b" />
                                    ))}
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)',
                                    lineHeight: 'var(--line-height-relaxed)',
                                    marginBottom: 'var(--space-6)',
                                    fontSize: 'var(--font-size-base)'
                                }}>
                                    "{testimonial.quote}"
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                    <div className="avatar avatar-md avatar-gradient">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{testimonial.author}</div>
                                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Pricing() {
    return (
        <section id="pricing" style={{
            padding: 'var(--space-24) var(--space-6)',
            background: 'white'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto var(--space-16)' }}>
                    <h2 style={{
                        fontSize: 'var(--font-size-3xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        Simple, transparent pricing
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-lg)' }}>
                        Start free, upgrade when you need more clients.
                    </p>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-1 gap-6" style={{ alignItems: 'stretch' }}>
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`pricing-card animate-fade-in-up ${plan.highlighted ? 'featured' : ''}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div>
                                <div className="pricing-plan-name">{plan.name}</div>
                                <div className="pricing-plan-description">{plan.description}</div>
                            </div>

                            <div className="pricing-price">
                                <span className="pricing-amount">${plan.price}</span>
                                <span className="pricing-period">/{plan.period}</span>
                            </div>

                            <div className="pricing-features">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="pricing-feature">
                                        <Check size={16} className="pricing-feature-icon" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/signup"
                                className={`btn w-full ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                            >
                                {plan.cta}
                                <ChevronRight size={16} />
                            </Link>
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
            padding: 'var(--space-24) var(--space-6)',
            background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
            color: 'white',
            textAlign: 'center'
        }}>
            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <h2 style={{
                    fontSize: 'var(--font-size-4xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--space-6)'
                }}>
                    Ready to impress your clients?
                </h2>
                <p style={{
                    fontSize: 'var(--font-size-xl)',
                    opacity: 0.9,
                    marginBottom: 'var(--space-8)'
                }}>
                    Join thousands of agencies using ClientLoop to deliver a professional client experience.
                </p>
                <Link to="/signup" className="btn btn-lg" style={{
                    background: 'white',
                    color: 'var(--color-primary-600)',
                    padding: 'var(--space-4) var(--space-8)',
                    fontSize: 'var(--font-size-lg)'
                }}>
                    Start Your Free Trial
                    <ArrowRight size={20} />
                </Link>
                <p style={{
                    marginTop: 'var(--space-4)',
                    fontSize: 'var(--font-size-sm)',
                    opacity: 0.7
                }}>
                    No credit card required · 14-day free trial
                </p>
            </div>
        </section>
    );
}

function Footer() {
    return (
        <footer style={{
            padding: 'var(--space-16) var(--space-6) var(--space-8)',
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-light)'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: 'var(--space-12)',
                    marginBottom: 'var(--space-12)'
                }} className="md:grid-cols-2">
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                            <div style={{
                                width: '36px',
                                height: '36px',
                                background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>
                                ClientLoop
                            </span>
                        </div>
                        <p style={{ color: 'var(--text-tertiary)', maxWidth: '300px', lineHeight: 'var(--line-height-relaxed)' }}>
                            The professional client portal for agencies. Share updates, files, and approvals in one clean interface.
                        </p>
                    </div>

                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>Product</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <a href="#features" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Features</a>
                            <a href="#pricing" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Pricing</a>
                            <a href="#" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Integrations</a>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>Company</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <a href="#" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>About</a>
                            <a href="#" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Blog</a>
                            <a href="#" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Careers</a>
                        </div>
                    </div>

                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-4)' }}>Login</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <Link to="/client-login" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Client Portal</Link>
                            <Link to="/login" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Agency Dashboard</Link>
                            <Link to="/signup" style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>Create Agency</Link>
                        </div>
                    </div>
                </div>

                <div style={{
                    borderTop: '1px solid var(--border-light)',
                    paddingTop: 'var(--space-8)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 'var(--space-4)'
                }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                        © 2026 ClientLoop. All rights reserved.
                    </p>
                </div>
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
            <Testimonials />
            <Pricing />
            <CTA />
            <Footer />
        </div>
    );
}
