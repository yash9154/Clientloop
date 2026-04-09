import { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
    Check,
    CreditCard,
    Zap,
    Crown,
    ArrowRight,
    Download,
    Calendar,
    AlertCircle
} from 'lucide-react';

const plans = [
    {
        id: 'free',
        name: 'Free',
        description: 'Perfect for trying out ClientLoop',
        price: 0,
        period: 'forever',
        features: [
            '1 client',
            '3 projects',
            'Basic updates',
            'File sharing (50MB)',
            'Email support'
        ],
        highlighted: false
    },
    {
        id: 'starter',
        name: 'Starter',
        description: 'Great for freelancers and small teams',
        price: 19,
        period: 'month',
        features: [
            'Up to 5 clients',
            'Unlimited projects',
            'Approval workflows',
            'File sharing (5GB)',
            'Priority email support',
            'Custom branding'
        ],
        highlighted: false
    },
    {
        id: 'agency',
        name: 'Agency',
        description: 'For growing agencies with multiple clients',
        price: 49,
        period: 'month',
        features: [
            'Unlimited clients',
            'Unlimited projects',
            'Advanced approval workflows',
            'File sharing (50GB)',
            'Priority support',
            'Custom branding',
            'Team members (up to 10)',
            'Analytics dashboard'
        ],
        highlighted: true
    }
];

const invoices = [
    { id: 'INV-001', date: '2026-01-07', amount: 49, status: 'paid' },
    { id: 'INV-002', date: '2025-12-07', amount: 49, status: 'paid' },
    { id: 'INV-003', date: '2025-11-07', amount: 49, status: 'paid' },
    { id: 'INV-004', date: '2025-10-07', amount: 49, status: 'paid' }
];

function PricingCard({ plan, currentPlan, onSelect }) {
    const isCurrentPlan = currentPlan === plan.id;

    return (
        <div className={`pricing-card ${plan.highlighted ? 'featured' : ''}`}>
            <div>
                <div className="pricing-plan-name">{plan.name}</div>
                <div className="pricing-plan-description">{plan.description}</div>
            </div>

            <div className="pricing-price">
                <span className="pricing-amount">${plan.price}</span>
                <span className="pricing-period">/{plan.period}</span>
            </div>

            <div className="pricing-features">
                {plan.features.map((feature, index) => (
                    <div key={index} className="pricing-feature">
                        <Check size={16} className="pricing-feature-icon" />
                        <span>{feature}</span>
                    </div>
                ))}
            </div>

            <button
                className={`btn w-full ${isCurrentPlan ? 'btn-secondary' : plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                disabled={isCurrentPlan}
                onClick={() => onSelect(plan.id)}
            >
                {isCurrentPlan ? 'Current Plan' : plan.price === 0 ? 'Downgrade' : 'Upgrade'}
                {!isCurrentPlan && <ArrowRight size={16} />}
            </button>
        </div>
    );
}

export default function BillingPage() {
    const { subscription } = useData();
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const currentPlan = plans.find(p => p.id === subscription.plan);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">Billing</h1>
                <p className="page-subtitle">Manage your subscription and billing details</p>
            </div>

            {/* Current Plan Card */}
            <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-8)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
                        <div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)',
                                marginBottom: 'var(--space-3)'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)',
                                    borderRadius: 'var(--radius-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white'
                                }}>
                                    <Crown size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-lg)' }}>
                                        {currentPlan?.name} Plan
                                    </div>
                                    <span className="badge badge-success">Active</span>
                                </div>
                            </div>
                            <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
                                {currentPlan?.description}
                            </p>
                            <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Monthly Cost</div>
                                    <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                                        ${subscription.amount}/mo
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Next Billing</div>
                                    <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                                        {formatDate(subscription.nextBillingDate)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>Clients Used</div>
                                    <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                                        {subscription.currentClients} / {subscription.clientLimit === 999 ? '∞' : subscription.clientLimit}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                            <button className="btn btn-secondary">
                                <CreditCard size={16} />
                                Update Payment
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Plans Comparison */}
            <h2 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-4)'
            }}>
                Available Plans
            </h2>
            <div className="grid grid-cols-3 lg:grid-cols-1 gap-6" style={{ marginBottom: 'var(--space-8)' }}>
                {plans.map((plan, index) => (
                    <div key={plan.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <PricingCard
                            plan={plan}
                            currentPlan={subscription.plan}
                            onSelect={(id) => console.log('Selected plan:', id)}
                        />
                    </div>
                ))}
            </div>

            {/* Payment Method */}
            <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-8)' }}>
                <div className="card-header">
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Payment Method
                    </h3>
                </div>
                <div className="card-body">
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-4)',
                        padding: 'var(--space-4)',
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #1a1f71 0%, #2563eb 100%)',
                            borderRadius: 'var(--radius-sm)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 'var(--font-size-xs)',
                            fontWeight: 'var(--font-weight-bold)'
                        }}>
                            VISA
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>•••• •••• •••• 4242</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                Expires 12/2027
                            </div>
                        </div>
                        <button className="btn btn-ghost btn-sm">Change</button>
                    </div>
                </div>
            </div>

            {/* Billing History */}
            <div className="card animate-fade-in-up">
                <div className="card-header">
                    <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)' }}>
                        Billing History
                    </h3>
                </div>
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Invoice</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((invoice) => (
                                <tr key={invoice.id}>
                                    <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{invoice.id}</td>
                                    <td>{formatDate(invoice.date)}</td>
                                    <td>${invoice.amount}.00</td>
                                    <td>
                                        <span className="badge badge-success">Paid</span>
                                    </td>
                                    <td>
                                        <button className="btn btn-ghost btn-sm">
                                            <Download size={14} />
                                            Download
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
