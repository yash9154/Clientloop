import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    FileText,
    Image,
    File,
    Download,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    Send,
    X,
    ThumbsUp,
    RefreshCcw
} from 'lucide-react';

function StatusBadge({ status }) {
    const config = {
        'not-started': { label: 'Not Started', class: 'badge-not-started' },
        'in-progress': { label: 'In Progress', class: 'badge-in-progress' },
        'waiting-approval': { label: 'Awaiting Approval', class: 'badge-waiting' },
        'completed': { label: 'Completed', class: 'badge-completed' }
    };

    const { label, class: className } = config[status] || config['not-started'];

    return <span className={`badge ${className}`}>{label}</span>;
}

function ApprovalBadge({ status }) {
    const config = {
        'pending': { label: 'Needs Your Approval', class: 'badge-pending', icon: Clock },
        'approved': { label: 'Approved', class: 'badge-approved', icon: CheckCircle2 },
        'changes-requested': { label: 'Changes Requested', class: 'badge-changes', icon: AlertCircle }
    };

    const { label, class: className, icon: Icon } = config[status] || {};

    if (!status) return null;

    return (
        <span className={`badge ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Icon size={12} />
            {label}
        </span>
    );
}

function RequestChangesModal({ isOpen, onClose, onSubmit }) {
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(note);
        setNote('');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Request Changes</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <p style={{ color: 'var(--text-tertiary)', marginBottom: 'var(--space-4)' }}>
                            Please describe what changes you'd like to see.
                        </p>
                        <div className="form-group">
                            <label className="form-label required">Change Request Details</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Describe the changes you'd like..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                rows={4}
                                required
                            />
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Submit Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UpdateCard({ update, onApprove, onRequestChanges, onAddComment, comments }) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [showChangesModal, setShowChangesModal] = useState(false);

    const uid = update._id || update.id;

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const handleAddComment = () => {
        if (newComment.trim()) {
            onAddComment({
                updateId: uid,
                author: user?.name,
                authorRole: 'client',
                content: newComment
            });
            setNewComment('');
        }
    };

    const getFileIcon = (type) => {
        switch (type) {
            case 'image':
                return <Image size={18} />;
            case 'pdf':
                return <FileText size={18} />;
            default:
                return <File size={18} />;
        }
    };

    const isPending = update.approvalStatus === 'pending';

    return (
        <div className="timeline-item animate-fade-in-up">
            <div className="timeline-icon">
                <FileText size={18} />
            </div>
            <div className="timeline-content">
                <div className="card">
                    <div className="card-body">
                        {/* Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            <div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>
                                    {formatDateTime(update.createdAt)}
                                </div>
                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                    Posted by <span style={{ color: 'var(--text-primary)', fontWeight: 'var(--font-weight-medium)' }}>{update.author}</span>
                                </div>
                            </div>
                            {update.approvalStatus && (
                                <ApprovalBadge status={update.approvalStatus} />
                            )}
                        </div>

                        {/* Title & Content */}
                        <h3 style={{
                            fontSize: 'var(--font-size-xl)',
                            fontWeight: 'var(--font-weight-semibold)',
                            marginBottom: 'var(--space-3)',
                            color: 'var(--text-primary)'
                        }}>
                            {update.title}
                        </h3>
                        <p style={{
                            color: 'var(--text-secondary)',
                            lineHeight: 'var(--line-height-relaxed)',
                            whiteSpace: 'pre-wrap',
                            fontSize: 'var(--font-size-base)'
                        }}>
                            {update.content}
                        </p>

                        {/* Attachments */}
                        {update.files?.length > 0 && (
                            <div style={{ marginTop: 'var(--space-5)' }}>
                                <div style={{
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--text-tertiary)',
                                    marginBottom: 'var(--space-3)'
                                }}>
                                    📎 Attachments
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {update.files.map((file, idx) => (
                                        <div key={file.publicId || idx} className="file-item">
                                            <div className="file-item-icon">
                                                {getFileIcon(file.type)}
                                            </div>
                                            <div className="file-item-info">
                                                <div className="file-item-name">{file.name}</div>
                                                <div className="file-item-size">{file.size}</div>
                                            </div>
                                            {file.url && (
                                                <a href={file.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                                                    <Download size={14} />
                                                    Download
                                                </a>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Approval Status Messages */}
                        {update.approvalStatus === 'changes-requested' && update.changeRequestNote && (
                            <div style={{
                                marginTop: 'var(--space-4)',
                                padding: 'var(--space-4)',
                                background: 'var(--color-warning-50)',
                                border: '1px solid var(--color-warning-200)',
                                borderRadius: 'var(--radius-lg)'
                            }}>
                                <div style={{
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--color-warning-700)',
                                    marginBottom: 'var(--space-2)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-2)'
                                }}>
                                    <RefreshCcw size={16} />
                                    Your Change Request
                                </div>
                                <p style={{ color: 'var(--color-warning-600)', fontSize: 'var(--font-size-sm)' }}>
                                    {update.changeRequestNote}
                                </p>
                            </div>
                        )}

                        {update.approvalStatus === 'approved' && (
                            <div style={{
                                marginTop: 'var(--space-4)',
                                padding: 'var(--space-4)',
                                background: 'var(--color-success-50)',
                                border: '1px solid var(--color-success-200)',
                                borderRadius: 'var(--radius-lg)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--space-3)'
                            }}>
                                <CheckCircle2 size={20} style={{ color: 'var(--color-success-600)' }} />
                                <div>
                                    <div style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--color-success-700)' }}>
                                        You approved this on {formatDateTime(update.approvedAt)}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Approval Actions - Large touchable buttons */}
                        {isPending && (
                            <div className="approval-actions">
                                <button
                                    className="btn btn-approve"
                                    onClick={() => onApprove(uid)}
                                    style={{ flex: 1 }}
                                >
                                    <ThumbsUp size={20} />
                                    Approve
                                </button>
                                <button
                                    className="btn btn-changes"
                                    onClick={() => setShowChangesModal(true)}
                                    style={{ flex: 1 }}
                                >
                                    <RefreshCcw size={20} />
                                    Request Changes
                                </button>
                            </div>
                        )}

                        {/* Comments */}
                        <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)' }}>
                            <button
                                className="btn btn-ghost"
                                onClick={() => setShowComments(!showComments)}
                                style={{ marginLeft: '-12px' }}
                            >
                                <MessageSquare size={16} />
                                {comments.length} Comment{comments.length !== 1 ? 's' : ''}
                            </button>

                            {showComments && (
                                <div style={{ marginTop: 'var(--space-3)' }}>
                                    {comments.map((comment, idx) => (
                                        <div key={comment._id || comment.id || idx} className="comment">
                                            <div className="avatar avatar-sm" style={{
                                                background: comment.authorRole === 'agency'
                                                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                                                    : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                color: 'white'
                                            }}>
                                                {comment.author?.charAt(0)}
                                            </div>
                                            <div className="comment-content">
                                                <div className="comment-header">
                                                    <span className="comment-author">{comment.author}</span>
                                                    <span className="comment-time">{formatDateTime(comment.createdAt)}</span>
                                                </div>
                                                <p className="comment-text">{comment.content}</p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add Comment */}
                                    <div className="comment-input-wrapper">
                                        <div className="avatar avatar-sm" style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white'
                                        }}>
                                            {user?.name?.charAt(0)}
                                        </div>
                                        <input
                                            type="text"
                                            className="form-input"
                                            placeholder="Add a comment..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                                        />
                                        <button
                                            className="btn btn-primary btn-icon"
                                            onClick={handleAddComment}
                                            disabled={!newComment.trim()}
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <RequestChangesModal
                    isOpen={showChangesModal}
                    onClose={() => setShowChangesModal(false)}
                    onSubmit={(note) => onRequestChanges(uid, note)}
                />
            </div>
        </div>
    );
}

export default function ClientProjectView() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const {
        getProject,
        getUpdatesByProject,
        getCommentsByUpdate,
        addComment,
        approveUpdate,
        requestChanges
    } = useData();

    const [updates, setUpdates] = useState([]);
    const [commentsMap, setCommentsMap] = useState({});

    const project = getProject(projectId);

    // Fetch updates when projectId changes
    useEffect(() => {
        if (!projectId) return;
        let cancelled = false;
        const fetchUpdates = async () => {
            const data = await getUpdatesByProject(projectId);
            if (!cancelled) setUpdates(data || []);
        };
        fetchUpdates();
        return () => { cancelled = true; };
    }, [projectId, getUpdatesByProject]);

    // Fetch comments for each update
    useEffect(() => {
        if (updates.length === 0) return;
        let cancelled = false;
        const fetchComments = async () => {
            const map = {};
            for (const update of updates) {
                const uid = update._id || update.id;
                if (uid) {
                    try {
                        map[uid] = await getCommentsByUpdate(uid);
                    } catch {
                        map[uid] = [];
                    }
                }
            }
            if (!cancelled) setCommentsMap(map);
        };
        fetchComments();
        return () => { cancelled = true; };
    }, [updates, getCommentsByUpdate]);

    const getCommentsForUpdate = useCallback((updateId) => {
        return commentsMap[updateId] || [];
    }, [commentsMap]);

    if (!project) {
        return (
            <div className="empty-state">
                <AlertCircle className="empty-state-icon" />
                <h3 className="empty-state-title">Project not found</h3>
                <p className="empty-state-description">The project you're looking for doesn't exist.</p>
                <Link to="/client" className="btn btn-primary">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const handleApprove = async (updateId) => {
        await approveUpdate(updateId, user?.name);
        // Refresh updates
        const freshUpdates = await getUpdatesByProject(projectId);
        setUpdates(freshUpdates || []);
    };

    const handleRequestChanges = async (updateId, note) => {
        await requestChanges(updateId, user?.name, note);
        // Refresh updates
        const freshUpdates = await getUpdatesByProject(projectId);
        setUpdates(freshUpdates || []);
    };

    const pendingCount = updates.filter(u => u.approvalStatus === 'pending').length;

    return (
        <div>
            {/* Back Button */}
            <Link
                to="/client"
                className="btn btn-ghost"
                style={{ marginBottom: 'var(--space-4)', marginLeft: '-12px' }}
            >
                <ArrowLeft size={18} />
                Back to Projects
            </Link>

            {/* Project Header */}
            <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                        <div>
                            <h1 style={{
                                fontSize: 'var(--font-size-2xl)',
                                fontWeight: 'var(--font-weight-bold)',
                                marginBottom: 'var(--space-2)'
                            }}>
                                {project.name}
                            </h1>
                            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px' }}>
                                {project.description}
                            </p>
                        </div>
                        <StatusBadge status={project.status} />
                    </div>
                </div>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-4)',
                    background: 'var(--color-warning-50)',
                    border: '1px solid var(--color-warning-200)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-6)'
                }} className="animate-fade-in-up">
                    <AlertCircle size={20} style={{ color: 'var(--color-warning-600)' }} />
                    <span style={{ color: 'var(--color-warning-700)', fontWeight: 'var(--font-weight-medium)' }}>
                        {pendingCount} update{pendingCount > 1 ? 's' : ''} waiting for your approval
                    </span>
                </div>
            )}

            {/* Updates Timeline */}
            <h2 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-4)'
            }}>
                Project Updates
            </h2>

            {updates.length === 0 ? (
                <div className="card">
                    <div className="empty-state" style={{ padding: 'var(--space-12)' }}>
                        <FileText className="empty-state-icon" />
                        <h3 className="empty-state-title">No updates yet</h3>
                        <p className="empty-state-description">
                            Updates from your agency will appear here.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="timeline">
                    {updates.map((update, index) => (
                        <div key={update._id || update.id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <UpdateCard
                                update={update}
                                comments={getCommentsForUpdate(update._id || update.id)}
                                onApprove={handleApprove}
                                onRequestChanges={handleRequestChanges}
                                onAddComment={addComment}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
