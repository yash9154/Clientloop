import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    ArrowLeft, Mail, Phone, Building2, User, Edit2, Trash2,
    X, Save, Key, Plus, Send, FileText, Calendar,
    CheckCircle2, Clock, AlertCircle, ThumbsUp, MessageSquare,
    StickyNote, PhoneCall, AtSign, Users, Package, CalendarCheck
} from 'lucide-react';

// ── HELPERS ───────────────────────────────────────────────────────

const GRADIENTS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#10b981,#059669)',
    'linear-gradient(135deg,#f59e0b,#d97706)',
    'linear-gradient(135deg,#3b82f6,#2563eb)',
    'linear-gradient(135deg,#ec4899,#db2777)',
    'linear-gradient(135deg,#14b8a6,#0d9488)',
];
const getGradient = (name) => GRADIENTS[(name || 'A').charCodeAt(0) % GRADIENTS.length];
const getInitials = (name) => (name || '??').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (d) => {
    const diff = Date.now() - new Date(d);
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(mins / 60);
    const days = Math.floor(hrs / 24);
    if (mins < 1)  return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hrs  < 24) return `${hrs}h ago`;
    if (days === 1) return 'Yesterday';
    return formatDate(d);
};

const NOTE_TYPES = [
    { value: 'note',      label: 'Note',      icon: StickyNote,    color: '#6366f1' },
    { value: 'call',      label: 'Call',       icon: PhoneCall,     color: '#10b981' },
    { value: 'email',     label: 'Email',      icon: AtSign,        color: '#3b82f6' },
    { value: 'meeting',   label: 'Meeting',    icon: Users,         color: '#f59e0b' },
    { value: 'proposal',  label: 'Proposal',   icon: Package,       color: '#8b5cf6' },
    { value: 'follow-up', label: 'Follow-up',  icon: CalendarCheck, color: '#ec4899' },
];
const getNoteType = (val) => NOTE_TYPES.find(t => t.value === val) || NOTE_TYPES[0];

// ── EDIT CLIENT MODAL ─────────────────────────────────────────────

function EditClientModal({ isOpen, onClose, client, onSave }) {
    const [form, setForm] = useState({
        name: '', email: '', contactName: '',
        phone: '', company: '', industry: '',
        status: 'active', followUpDate: '', password: ''
    });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    useEffect(() => {
        if (client) {
            setForm({
                name:        client.name        || '',
                email:       client.email       || '',
                contactName: client.contactName || '',
                phone:       client.phone       || '',
                company:     client.company     || '',
                industry:    client.industry    || '',
                status:      client.status      || 'active',
                followUpDate: client.followUpDate
                    ? new Date(client.followUpDate).toISOString().split('T')[0]
                    : '',
                password: ''
            });
        }
    }, [client]);

    if (!isOpen) return null;

    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const payload = { ...form };
            if (!payload.password.trim()) delete payload.password;
            if (!payload.followUpDate)    delete payload.followUpDate;
            await onSave(payload);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Client</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {error && (
                            <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-50)', border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)' }}>
                                {error}
                            </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label required">Client / Company Name</label>
                                <input className="form-input" value={form.name} onChange={set('name')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label required">Email</label>
                                <input className="form-input" type="email" value={form.email} onChange={set('email')} required />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Contact Person</label>
                                <input className="form-input" value={form.contactName} onChange={set('contactName')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input className="form-input" value={form.phone} onChange={set('phone')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Company</label>
                                <input className="form-input" value={form.company} onChange={set('company')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Industry</label>
                                <input className="form-input" placeholder="e.g. Technology" value={form.industry} onChange={set('industry')} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-input form-select" value={form.status} onChange={set('status')}>
                                    <option value="active">Active</option>
                                    <option value="lead">Lead</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Follow-up Date</label>
                                <input className="form-input" type="date" value={form.followUpDate} onChange={set('followUpDate')} />
                            </div>
                        </div>
                        <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', fontWeight: 'var(--font-weight-semibold)' }}>
                                <Key size={15} /> Update Portal Password
                            </div>
                            <p className="form-helper" style={{ marginBottom: 'var(--space-3)' }}>Leave blank to keep current password.</p>
                            <input className="form-input" type="text" placeholder="New password (min 6 chars)" value={form.password} onChange={set('password')} />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── POST UPDATE MODAL ─────────────────────────────────────────────

function PostUpdateModal({ isOpen, onClose, clientId, onCreated }) {
    const { addUpdate } = useData();
    const [form, setForm] = useState({ title: '', content: '', type: 'progress', requiresApproval: false });
    const [saving, setSaving] = useState(false);
    const [error, setError]   = useState('');

    if (!isOpen) return null;
    const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true); setError('');
        try {
            const update = await addUpdate({ ...form, clientId });
            onCreated(update);
            setForm({ title: '', content: '', type: 'progress', requiresApproval: false });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to post update');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Post Update</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {error && (
                            <div style={{ padding: 'var(--space-3)', background: 'var(--color-error-50)', border: '1px solid var(--color-error-100)', borderRadius: 'var(--radius-lg)', color: 'var(--color-error-600)', fontSize: 'var(--font-size-sm)' }}>
                                {error}
                            </div>
                        )}
                        <div className="form-group">
                            <label className="form-label required">Title</label>
                            <input className="form-input" placeholder="e.g. Homepage design completed" value={form.title} onChange={set('title')} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Content</label>
                            <textarea className="form-input form-textarea" placeholder="Describe the update in detail..." value={form.content} onChange={set('content')} rows={4} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                            <div className="form-group">
                                <label className="form-label">Update Type</label>
                                <select className="form-input form-select" value={form.type} onChange={set('type')}>
                                    <option value="progress">Progress</option>
                                    <option value="milestone">Milestone</option>
                                    <option value="delivery">Delivery</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ justifyContent: 'flex-end' }}>
                                <label className="form-label">Requires Approval?</label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer', marginTop: 'var(--space-2)' }}>
                                    <input
                                        type="checkbox"
                                        checked={form.requiresApproval}
                                        onChange={e => setForm(p => ({ ...p, requiresApproval: e.target.checked }))}
                                    />
                                    <span style={{ fontSize: 'var(--font-size-sm)' }}>Ask client to approve this</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Posting...' : <><Send size={16} /> Post Update</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── NOTES TIMELINE ────────────────────────────────────────────────

function NotesTimeline({ clientId }) {
    const { getNotesByClient, addNote, deleteNote } = useData();
    const [notes, setNotes]         = useState([]);
    const [loading, setLoading]     = useState(true);
    const [content, setContent]     = useState('');
    const [noteType, setNoteType]   = useState('note');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getNotesByClient(clientId);
            setNotes(data);
            setLoading(false);
        };
        fetch();
    }, [clientId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            const note = await addNote({ clientId, content: content.trim(), type: noteType });
            setNotes(prev => [note, ...prev]);
            setContent('');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (noteId) => {
        await deleteNote(noteId);
        setNotes(prev => prev.filter(n => n._id !== noteId));
    };

    return (
        <div>
            {/* Add note form */}
            <form onSubmit={handleAdd} style={{ marginBottom: 'var(--space-5)' }}>
                <div className="card">
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {/* Type selector */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            {NOTE_TYPES.map(t => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setNoteType(t.value)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                        padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                        cursor: 'pointer', border: 'none',
                                        background: noteType === t.value ? t.color : 'var(--bg-tertiary)',
                                        color: noteType === t.value ? 'white' : 'var(--text-secondary)',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    <t.icon size={12} />
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <textarea
                            className="form-input form-textarea"
                            placeholder="Add a note, log a call, or record any interaction..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            rows={2}
                            style={{ resize: 'none' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting || !content.trim()}>
                                {submitting ? 'Adding...' : <><Plus size={14} /> Add Note</>}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Timeline */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    <Clock size={28} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
                    <p>Loading timeline...</p>
                </div>
            ) : notes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-tertiary)' }}>
                    <StickyNote size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
                    <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>No notes yet</p>
                    <p style={{ fontSize: 'var(--font-size-sm)' }}>Log calls, meetings, emails — build a history of this relationship.</p>
                </div>
            ) : (
                <div style={{ position: 'relative' }}>
                    {/* Vertical line */}
                    <div style={{
                        position: 'absolute', left: '19px', top: '24px',
                        bottom: '0', width: '2px',
                        background: 'var(--border-light)', zIndex: 0
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {notes.map((note, i) => {
                            const nt = getNoteType(note.type);
                            return (
                                <div key={note._id} className="animate-fade-in-up" style={{ display: 'flex', gap: 'var(--space-4)', position: 'relative', animationDelay: `${i * 0.04}s` }}>
                                    {/* Dot */}
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%',
                                        background: nt.color, color: 'white',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, zIndex: 1,
                                        boxShadow: '0 0 0 4px white'
                                    }}>
                                        <nt.icon size={16} />
                                    </div>
                                    {/* Card */}
                                    <div className="card" style={{ flex: 1 }}>
                                        <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                                    <span style={{
                                                        fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)',
                                                        padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                                        background: nt.color + '20', color: nt.color
                                                    }}>
                                                        {nt.label}
                                                    </span>
                                                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                                        {formatTime(note.createdAt)}
                                                    </span>
                                                </div>
                                                <button
                                                    className="btn btn-ghost btn-icon"
                                                    style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }}
                                                    onClick={() => handleDelete(note._id)}
                                                    title="Delete note"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                                                {note.content}
                                            </p>
                                            {note.authorName && (
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                                                    — {note.authorName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// ── UPDATES SECTION ───────────────────────────────────────────────

function UpdatesSection({ clientId }) {
    const { getUpdatesByClient, deleteUpdate } = useData();
    const [updates, setUpdates]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [showPost, setShowPost]   = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getUpdatesByClient(clientId);
            setUpdates(data);
            setLoading(false);
        };
        fetch();
    }, [clientId]);

    const handleCreated = (update) => setUpdates(prev => [update, ...prev]);

    const handleDelete = async (updateId) => {
        if (!window.confirm('Delete this update?')) return;
        await deleteUpdate(updateId);
        setUpdates(prev => prev.filter(u => u._id !== updateId));
    };

    const approvalStyle = {
        none:               { bg: 'var(--color-gray-100)',    text: 'var(--color-gray-600)'    },
        pending:            { bg: 'var(--color-warning-100)', text: 'var(--color-warning-700)' },
        approved:           { bg: 'var(--color-success-100)', text: 'var(--color-success-700)' },
        'changes-requested':{ bg: 'var(--color-error-100)',   text: 'var(--color-error-700)'   },
    };
    const approvalLabel = {
        none: 'No Approval Needed', pending: 'Pending Approval',
        approved: 'Approved', 'changes-requested': 'Changes Requested'
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-4)' }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowPost(true)}>
                    <Plus size={15} /> Post Update
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--text-tertiary)' }}>
                    <Clock size={28} style={{ margin: '0 auto var(--space-3)', opacity: 0.4 }} />
                    <p>Loading updates...</p>
                </div>
            ) : updates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-tertiary)' }}>
                    <FileText size={36} style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }} />
                    <p style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: 'var(--space-1)' }}>No updates yet</p>
                    <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-4)' }}>Post updates to keep this client informed.</p>
                    <button className="btn btn-primary btn-sm" onClick={() => setShowPost(true)}>
                        <Plus size={14} /> Post First Update
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    {updates.map((update, i) => {
                        const as = approvalStyle[update.approvalStatus] || approvalStyle.none;
                        const typeColors = {
                            progress:  '#3b82f6',
                            milestone: '#8b5cf6',
                            delivery:  '#10b981',
                        };
                        return (
                            <div key={update._id} className="card animate-fade-in-up" style={{ animationDelay: `${i * 0.04}s`, border: update.approvalStatus === 'changes-requested' ? '2px solid var(--color-error-300)' : undefined }}>
                                <div className="card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                                background: typeColors[update.type] + '20',
                                                color: typeColors[update.type],
                                                textTransform: 'capitalize'
                                            }}>
                                                {update.type}
                                            </span>
                                            <span style={{
                                                fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                                padding: '2px 8px', borderRadius: 'var(--radius-full)',
                                                background: as.bg, color: as.text
                                            }}>
                                                {approvalLabel[update.approvalStatus]}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                                {formatTime(update.createdAt)}
                                            </span>
                                            <button
                                                className="btn btn-ghost btn-icon"
                                                style={{ width: '28px', height: '28px', color: 'var(--text-muted)' }}
                                                onClick={() => handleDelete(update._id)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <h4 style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
                                        {update.title}
                                    </h4>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                                        {update.content}
                                    </p>

                                    {update.approvalStatus === 'changes-requested' && update.changeRequestNote && (
                                        <div style={{
                                            marginTop: 'var(--space-3)', padding: 'var(--space-3)',
                                            background: 'var(--color-error-50)', borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--color-error-100)'
                                        }}>
                                            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-error-700)', marginBottom: '4px' }}>
                                                Client requested changes:
                                            </p>
                                            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-error-700)' }}>
                                                {update.changeRequestNote}
                                            </p>
                                        </div>
                                    )}

                                    {update.approvalStatus === 'approved' && (
                                        <div style={{ marginTop: 'var(--space-3)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                                            <CheckCircle2 size={14} style={{ color: 'var(--color-success-600)' }} />
                                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-700)' }}>
                                                Approved by {update.approvedBy} {update.approvedAt ? `on ${formatDate(update.approvedAt)}` : ''}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <PostUpdateModal
                isOpen={showPost}
                onClose={() => setShowPost(false)}
                clientId={clientId}
                onCreated={handleCreated}
            />
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────

export default function ClientDetailPage() {
    const { clientId }  = useParams();
    const navigate      = useNavigate();
    const { clients, updateClient, deleteClient } = useData();
    const [showEdit, setShowEdit] = useState(false);
    const [activeTab, setActiveTab] = useState('notes');

    const client = clients.find(c => c._id === clientId);

    if (!client) {
        return (
            <div className="empty-state">
                <AlertCircle className="empty-state-icon" />
                <h3 className="empty-state-title">Client not found</h3>
                <Link to="/clients" className="btn btn-primary"><ArrowLeft size={18} /> Back to Clients</Link>
            </div>
        );
    }

    const statusStyle = {
        active:   { bg: 'var(--color-success-100)', text: 'var(--color-success-700)' },
        inactive: { bg: 'var(--color-gray-100)',     text: 'var(--color-gray-600)'    },
        lead:     { bg: 'var(--color-info-100)',     text: 'var(--color-info-600)'    },
    }[client.status] || {};

    const isFollowUpOverdue = client.followUpDate && new Date(client.followUpDate) <= new Date();

    const handleSave = async (data) => {
        await updateClient(client._id, data);
    };

    const handleDelete = async () => {
        if (!window.confirm('Delete this client and all their data? This cannot be undone.')) return;
        await deleteClient(client._id);
        navigate('/clients');
    };

    const tabs = [
        { key: 'notes',   label: 'Notes & Activity', icon: StickyNote },
        { key: 'updates', label: 'Updates',           icon: FileText   },
    ];

    return (
        <div>
            {/* Back */}
            <Link to="/clients" className="btn btn-ghost" style={{ marginBottom: 'var(--space-4)', marginLeft: '-12px' }}>
                <ArrowLeft size={18} /> Back to Clients
            </Link>

            {/* Client Header Card */}
            <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        {/* Avatar */}
                        <div className="avatar avatar-xl" style={{ background: getGradient(client.name), color: 'white', fontSize: 'var(--font-size-2xl)', flexShrink: 0 }}>
                            {getInitials(client.name)}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-1)' }}>
                                <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--text-primary)' }}>
                                    {client.name}
                                </h1>
                                <span style={{
                                    fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)',
                                    padding: '3px 10px', borderRadius: 'var(--radius-full)',
                                    background: statusStyle.bg, color: statusStyle.text,
                                    textTransform: 'capitalize'
                                }}>
                                    {client.status}
                                </span>
                            </div>

                            {client.contactName && (
                                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>
                                    {client.contactName}
                                    {client.company ? ` · ${client.company}` : ''}
                                    {client.industry ? ` · ${client.industry}` : ''}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                                    <Mail size={14} /> {client.email}
                                </div>
                                {client.phone && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                                        <Phone size={14} /> {client.phone}
                                    </div>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                                    <Calendar size={14} /> Since {formatDate(client.createdAt)}
                                </div>
                            </div>

                            {/* Follow-up banner */}
                            {client.followUpDate && (
                                <div style={{
                                    marginTop: 'var(--space-3)',
                                    display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
                                    padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                    background: isFollowUpOverdue ? 'var(--color-error-100)' : 'var(--color-warning-100)',
                                    color: isFollowUpOverdue ? 'var(--color-error-700)' : 'var(--color-warning-700)',
                                    fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)'
                                }}>
                                    <CalendarCheck size={13} />
                                    {isFollowUpOverdue ? 'Follow-up overdue · ' : 'Follow-up · '}
                                    {formatDate(client.followUpDate)}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 'var(--space-2)', flexShrink: 0 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setShowEdit(true)}>
                                <Edit2 size={15} /> Edit
                            </button>
                            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-error-600)' }} onClick={handleDelete}>
                                <Trash2 size={15} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 'var(--space-6)', borderBottom: '2px solid var(--border-light)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
                            padding: 'var(--space-3) var(--space-5)',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)',
                            color: activeTab === tab.key ? 'var(--color-primary-600)' : 'var(--text-tertiary)',
                            borderBottom: activeTab === tab.key ? '2px solid var(--color-primary-600)' : '2px solid transparent',
                            marginBottom: '-2px', transition: 'all var(--transition-fast)'
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            {activeTab === 'notes'   && <NotesTimeline   clientId={client._id} />}
            {activeTab === 'updates' && <UpdatesSection  clientId={client._id} />}

            <EditClientModal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
                client={client}
                onSave={handleSave}
            />
        </div>
    );
}