import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, FileText, ThumbsUp, MessageSquare } from 'lucide-react';

// ── STATUS BADGE ─────────────────────────────────────────────────

function ApprovalBadge({ status }) {
    const config = {
        'none':               { label: 'No Approval Needed', bg: 'var(--color-gray-100)',    text: 'var(--color-gray-600)'    },
        'pending':            { label: 'Awaiting Your Approval', bg: 'var(--color-warning-100)', text: 'var(--color-warning-700)' },
        'approved':           { label: 'Approved',             bg: 'var(--color-success-100)', text: 'var(--color-success-700)' },
        'changes-requested':  { label: 'Changes Requested',    bg: 'var(--color-error-100)',   text: 'var(--color-error-700)'   },
    };
    const c = config[status] || config['none'];
    return (
        <span style={{
            fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
            padding: '3px 10px', borderRadius: 'var(--radius-full)',
            background: c.bg, color: c.text
        }}>
            {c.label}
        </span>
    );
}

// ── UPDATE CARD ──────────────────────────────────────────────────

function UpdateCard({ update, onApprove, onRequestChanges }) {
    const [showChangeInput, setShowChangeInput] = useState(false);
    const [changeNote, setChangeNote] = useState('');
    const [loading, setLoading] = useState(false);

    const typeColors = {
        progress:  { bg: 'var(--color-info-100)',    text: 'var(--color-info-600)'    },
        milestone: { bg: 'var(--color-primary-100)', text: 'var(--color-primary-600)' },
        delivery:  { bg: 'var(--color-success-100)', text: 'var(--color-success-600)' },
    };
    const tc = typeColors[update.type] || typeColors.progress;

    const formatDate = (d) => new Date(d).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const handleApprove = async () => {
        setLoading(true);
        try { await onApprove(update._id); }
        finally { setLoading(false); }
    };

    const handleRequestChanges = async () => {
        if (!changeNote.trim()) return;
        setLoading(true);
        try {
            await onRequestChanges(update._id, changeNote);
            setShowChangeInput(false);
            setChangeNote('');
        } finally { setLoading(false); }
    };

    return (
        <div className="card animate-fade-in-up" style={{
            border: update.approvalStatus === 'pending'
                ? '2px solid var(--color-warning-300)'
                : '1px solid var(--border-light)'
        }}>
            <div className="card-body">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                        <span style={{
                            fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                            padding: '2px 8px', borderRadius: 'var(--radius-full)',
                            background: tc.bg, color: tc.text, textTransform: 'capitalize'
                        }}>
                            {update.type}
                        </span>
                        <ApprovalBadge status={update.approvalStatus} />
                    </div>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                        {formatDate(update.createdAt)}
                    </span>
                </div>

                {/* Title */}
                <h3 style={{
                    fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--text-primary)', marginBottom: 'var(--space-2)'
                }}>
                    {update.title}
                </h3>

                {/* Content */}
                <p style={{
                    fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)',
                    lineHeight: 'var(--line-height-relaxed)', marginBottom: 'var(--space-3)'
                }}>
                    {update.content}
                </p>

                {/* Author */}
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                    Posted by {update.authorName || 'Agency'}
                </div>

                {/* Change request note */}
                {update.approvalStatus === 'changes-requested' && update.changeRequestNote && (
                    <div style={{
                        padding: 'var(--space-3)', background: 'var(--color-error-50)',
                        border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--space-3)'
                    }}>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-error-600)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
                            Your change request:
                        </p>
                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-error-700)' }}>
                            {update.changeRequestNote}
                        </p>
                    </div>
                )}

                {/* Approval approved info */}
                {update.approvalStatus === 'approved' && (
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                        padding: 'var(--space-2) var(--space-3)',
                        background: 'var(--color-success-50)', borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--space-3)'
                    }}>
                        <CheckCircle2 size={14} style={{ color: 'var(--color-success-600)' }} />
                        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-700)' }}>
                            Approved by you {update.approvedAt ? `on ${formatDate(update.approvedAt)}` : ''}
                        </span>
                    </div>
                )}

                {/* Action buttons — only show if pending */}
                {update.approvalStatus === 'pending' && (
                    <div>
                        {!showChangeInput ? (
                            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                                <button
                                    className="btn btn-success"
                                    onClick={handleApprove}
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    <ThumbsUp size={16} />
                                    {loading ? 'Approving...' : 'Approve'}
                                </button>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowChangeInput(true)}
                                    disabled={loading}
                                    style={{ flex: 1 }}
                                >
                                    <MessageSquare size={16} />
                                    Request Changes
                                </button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                <textarea
                                    className="form-input form-textarea"
                                    placeholder="Describe what changes you need..."
                                    value={changeNote}
                                    onChange={e => setChangeNote(e.target.value)}
                                    rows={3}
                                />
                                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                    <button className="btn btn-secondary btn-sm" onClick={() => { setShowChangeInput(false); setChangeNote(''); }}>
                                        Cancel
                                    </button>
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleRequestChanges}
                                        disabled={loading || !changeNote.trim()}
                                    >
                                        {loading ? 'Sending...' : 'Send Request'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────────

export default function ClientDashboard() {
    const { getMyUpdates, approveUpdate, requestChanges } = useData();
    const { user } = useAuth();
    const [updates, setUpdates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const data = await getMyUpdates();
                setUpdates(data);
            } catch (err) {
                console.error('Error loading updates:', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const handleApprove = async (updateId) => {
        const updated = await approveUpdate(updateId);
        setUpdates(prev => prev.map(u => u._id === updateId ? updated : u));
    };

    const handleRequestChanges = async (updateId, note) => {
        const updated = await requestChanges(updateId, note);
        setUpdates(prev => prev.map(u => u._id === updateId ? updated : u));
    };

    const pendingCount  = updates.filter(u => u.approvalStatus === 'pending').length;
    const approvedCount = updates.filter(u => u.approvalStatus === 'approved').length;

    const filtered = filter === 'all'
        ? updates
        : updates.filter(u => u.approvalStatus === filter);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'var(--space-6)' }}>
            {/* Welcome */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', marginBottom: 'var(--space-1)' }}>
                    Hello, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'var(--text-tertiary)' }}>
                    Here are your project updates from your agency.
                </p>
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {[
                    { icon: FileText,     label: 'Total Updates',   value: updates.length,  color: 'primary' },
                    { icon: AlertCircle,  label: 'Needs Approval',  value: pendingCount,    color: 'warning' },
                    { icon: CheckCircle2, label: 'Approved',        value: approvedCount,   color: 'success' },
                ].map(({ icon: Icon, label, value, color }) => {
                    const colors = {
                        primary: { bg: 'var(--color-primary-100)', text: 'var(--color-primary-600)' },
                        warning: { bg: 'var(--color-warning-100)', text: 'var(--color-warning-600)' },
                        success: { bg: 'var(--color-success-100)', text: 'var(--color-success-600)' },
                    };
                    return (
                        <div key={label} className="stat-card">
                            <div className="stat-icon" style={{ background: colors[color].bg, color: colors[color].text }}>
                                <Icon size={20} />
                            </div>
                            <div className="stat-content">
                                <div className="stat-label">{label}</div>
                                <div className="stat-value">{value}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pending alert banner */}
            {pendingCount > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    background: 'var(--color-warning-50)',
                    border: '1px solid var(--color-warning-200)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-6)'
                }}>
                    <AlertCircle size={20} style={{ color: 'var(--color-warning-600)', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning-800)', fontSize: 'var(--font-size-sm)' }}>
                            Action Required
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-700)' }}>
                            You have {pendingCount} update{pendingCount > 1 ? 's' : ''} waiting for your approval.
                        </div>
                    </div>
                </div>
            )}

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
                {[
                    { key: 'all',               label: `All (${updates.length})`      },
                    { key: 'pending',            label: `Pending (${pendingCount})`    },
                    { key: 'approved',           label: `Approved (${approvedCount})`  },
                    { key: 'changes-requested',  label: 'Changes Requested'            },
                ].map(tab => (
                    <button
                        key={tab.key}
                        className={`btn btn-sm ${filter === tab.key ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Updates list */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-tertiary)' }}>
                    <Clock size={32} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
                    <p>Loading updates...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--text-tertiary)' }}>
                    <FileText size={40} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
                    <h3 style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--space-2)' }}>
                        {filter === 'all' ? 'No updates yet' : `No ${filter} updates`}
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-sm)' }}>
                        {filter === 'all'
                            ? 'Your agency will post updates here as your project progresses.'
                            : 'Try switching to a different filter.'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {filtered.map((update, i) => (
                        <div key={update._id} style={{ animationDelay: `${i * 0.05}s` }}>
                            <UpdateCard
                                update={update}
                                onApprove={handleApprove}
                                onRequestChanges={handleRequestChanges}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}