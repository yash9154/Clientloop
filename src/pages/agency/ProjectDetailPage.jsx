import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    ArrowLeft,
    Plus,
    FileText,
    Image,
    File,
    Download,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    MessageSquare,
    Paperclip,
    Upload,
    X,
    MoreHorizontal,
    ChevronDown
} from 'lucide-react';

function StatusBadge({ status }) {
    const config = {
        'not-started': { label: 'Not Started', class: 'badge-not-started' },
        'in-progress': { label: 'In Progress', class: 'badge-in-progress' },
        'waiting-approval': { label: 'Waiting for Approval', class: 'badge-waiting' },
        'completed': { label: 'Completed', class: 'badge-completed' }
    };

    const { label, class: className } = config[status] || config['not-started'];

    return <span className={`badge ${className}`}>{label}</span>;
}

function ApprovalBadge({ status }) {
    const config = {
        'pending': { label: 'Pending Approval', class: 'badge-pending', icon: Clock },
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

function PostUpdateModal({ isOpen, onClose, onSubmit }) {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [requiresApproval, setRequiresApproval] = useState(false);
    const [files, setFiles] = useState([]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            content,
            requiresApproval,
            author: user?.name,
            authorRole: 'agency',
            type: 'progress',
            attachments: files.map((f, i) => ({
                id: `file-new-${i}`,
                name: f.name,
                size: `${(f.size / 1024).toFixed(1)} KB`,
                type: f.type.includes('image') ? 'image' : 'pdf'
            }))
        });
        setTitle('');
        setContent('');
        setRequiresApproval(false);
        setFiles([]);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Post Update</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label required">Title</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g., Homepage Design Completed"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label required">Update Content</label>
                            <textarea
                                className="form-input form-textarea"
                                placeholder="Describe the update in detail..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={5}
                                required
                            />
                        </div>

                        {/* File Upload */}
                        <div className="form-group" style={{ marginBottom: 'var(--space-4)' }}>
                            <label className="form-label">Attachments</label>
                            <div className="file-upload">
                                <input
                                    type="file"
                                    multiple
                                    onChange={(e) => setFiles([...files, ...Array.from(e.target.files)])}
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                    <Upload size={24} style={{ margin: '0 auto var(--space-2)', color: 'var(--text-tertiary)' }} />
                                    <p style={{ fontWeight: 'var(--font-weight-medium)', color: 'var(--text-primary)' }}>
                                        Click to upload or drag and drop
                                    </p>
                                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                        PDF, PNG, JPG up to 10MB
                                    </p>
                                </label>
                            </div>
                            {files.length > 0 && (
                                <div style={{ marginTop: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                                    {files.map((file, index) => (
                                        <div key={index} className="file-item">
                                            <div className="file-item-icon">
                                                <FileText size={18} />
                                            </div>
                                            <div className="file-item-info">
                                                <div className="file-item-name">{file.name}</div>
                                                <div className="file-item-size">{(file.size / 1024).toFixed(1)} KB</div>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-ghost btn-icon"
                                                onClick={() => setFiles(files.filter((_, i) => i !== index))}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approval Checkbox */}
                        <label style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--space-3)',
                            padding: 'var(--space-4)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer'
                        }}>
                            <input
                                type="checkbox"
                                checked={requiresApproval}
                                onChange={(e) => setRequiresApproval(e.target.checked)}
                                style={{ width: '18px', height: '18px' }}
                            />
                            <div>
                                <div style={{ fontWeight: 'var(--font-weight-medium)' }}>Request Approval</div>
                                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-tertiary)' }}>
                                    Client will be asked to approve or request changes
                                </div>
                            </div>
                        </label>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Send size={16} />
                            Post Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function UpdateCard({ update, onAddComment, comments }) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

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
                updateId: update._id || update.id,
                author: user?.name,
                authorRole: user?.role,
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

    return (
        <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-4)' }}>
            <div className="card-body">
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                        <div className="avatar avatar-md avatar-gradient">
                            {update.author?.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{update.author}</div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>
                                {formatDateTime(update.createdAt)}
                            </div>
                        </div>
                    </div>
                    {update.approvalStatus && (
                        <ApprovalBadge status={update.approvalStatus} />
                    )}
                </div>

                {/* Title & Content */}
                <h3 style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    marginBottom: 'var(--space-3)'
                }}>
                    {update.title}
                </h3>
                <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: 'var(--line-height-relaxed)',
                    whiteSpace: 'pre-wrap'
                }}>
                    {update.content}
                </p>

                {/* Change Request Note */}
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
                            <AlertCircle size={16} />
                            Changes Requested by {update.changeRequestedBy}
                        </div>
                        <p style={{ color: 'var(--color-warning-600)', fontSize: 'var(--font-size-sm)' }}>
                            {update.changeRequestNote}
                        </p>
                    </div>
                )}

                {/* Approval Success */}
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
                                Approved by {update.approvedBy}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-success-600)' }}>
                                {formatDateTime(update.approvedAt)}
                            </div>
                        </div>
                    </div>
                )}

                {/* Attachments */}
                {update.attachments?.length > 0 && (
                    <div style={{ marginTop: 'var(--space-4)' }}>
                        <div style={{
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--text-tertiary)',
                            marginBottom: 'var(--space-2)'
                        }}>
                            Attachments
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                            {update.attachments.map((file) => (
                                <div key={file.id} className="file-item" style={{ flex: '1 1 200px', maxWidth: '300px' }}>
                                    <div className="file-item-icon">
                                        {getFileIcon(file.type)}
                                    </div>
                                    <div className="file-item-info">
                                        <div className="file-item-name">{file.name}</div>
                                        <div className="file-item-size">{file.size}</div>
                                    </div>
                                    <button className="btn btn-ghost btn-icon">
                                        <Download size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Comments Toggle */}
                <button
                    className="btn btn-ghost"
                    onClick={() => setShowComments(!showComments)}
                    style={{ marginTop: 'var(--space-4)', marginLeft: '-12px' }}
                >
                    <MessageSquare size={16} />
                    {comments.length} Comments
                    <ChevronDown size={14} style={{ transform: showComments ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                {/* Comments Section */}
                {showComments && (
                    <div style={{ marginTop: 'var(--space-3)', borderTop: '1px solid var(--border-light)' }}>
                        {comments.map((comment) => (
                            <div key={comment.id} className="comment">
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
                            <div className="avatar avatar-sm avatar-gradient">
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
    );
}

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const {
        getProject,
        getClient,
        getUpdatesByProject,
        getCommentsByUpdate,
        addUpdate,
        addComment,
        updateProject
    } = useData();

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('updates');
    const [updates, setUpdates] = useState([]);
    const [commentsMap, setCommentsMap] = useState({});

    const project = getProject(projectId);
    const client = project ? getClient(project.clientId) : null;

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
                <Link to="/projects" className="btn btn-primary">
                    <ArrowLeft size={18} />
                    Back to Projects
                </Link>
            </div>
        );
    }

    const pid = project?._id || project?.id;

    const handlePostUpdate = async (updateData) => {
        await addUpdate({
            ...updateData,
            projectId: pid
        });
        // Refresh updates
        const freshUpdates = await getUpdatesByProject(projectId);
        setUpdates(freshUpdates || []);
        // Update project status if approval is requested
        if (updateData.requiresApproval) {
            updateProject(pid, { status: 'waiting-approval' });
        }
    };

    const statusOptions = [
        { value: 'not-started', label: 'Not Started' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'waiting-approval', label: 'Waiting for Approval' },
        { value: 'completed', label: 'Completed' }
    ];

    return (
        <div>
            {/* Breadcrumb */}
            <Link
                to="/projects"
                className="btn btn-ghost"
                style={{ marginBottom: 'var(--space-4)', marginLeft: '-12px' }}
            >
                <ArrowLeft size={18} />
                Back to Projects
            </Link>

            {/* Project Header */}
            <div className="card animate-fade-in-up" style={{ marginBottom: 'var(--space-6)' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
                        <div>
                            <div style={{
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-tertiary)',
                                marginBottom: 'var(--space-2)'
                            }}>
                                <Link to={`/clients/${client?._id || client?.id}`} style={{ color: 'var(--color-primary-600)' }}>
                                    {client?.name}
                                </Link>
                            </div>
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

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                            <select
                                className="form-input form-select"
                                value={project.status}
                                onChange={(e) => updateProject(pid, { status: e.target.value })}
                                style={{ width: 'auto' }}
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowUpdateModal(true)}
                            >
                                <Plus size={18} />
                                Post Update
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 'var(--space-6)' }}>
                <button
                    className={`tab ${activeTab === 'updates' ? 'active' : ''}`}
                    onClick={() => setActiveTab('updates')}
                >
                    Updates ({updates.length})
                </button>
                <button
                    className={`tab ${activeTab === 'files' ? 'active' : ''}`}
                    onClick={() => setActiveTab('files')}
                >
                    Files
                </button>
            </div>

            {/* Updates Timeline */}
            {activeTab === 'updates' && (
                <>
                    {updates.length === 0 ? (
                        <div className="card">
                            <div className="empty-state" style={{ padding: 'var(--space-12)' }}>
                                <FileText className="empty-state-icon" />
                                <h3 className="empty-state-title">No updates yet</h3>
                                <p className="empty-state-description">
                                    Post your first update to keep the client informed.
                                </p>
                                <button className="btn btn-primary" onClick={() => setShowUpdateModal(true)}>
                                    <Plus size={18} />
                                    Post Update
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {updates.map((update, index) => (
                                <div key={update._id || update.id} style={{ animationDelay: `${index * 0.05}s` }}>
                                    <UpdateCard
                                        update={update}
                                        comments={getCommentsForUpdate(update._id || update.id)}
                                        onAddComment={addComment}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
                <div className="card">
                    <div className="card-body">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                            {updates.flatMap(u => u.attachments || []).length === 0 ? (
                                <div className="empty-state" style={{ width: '100%', padding: 'var(--space-12)' }}>
                                    <Paperclip className="empty-state-icon" />
                                    <h3 className="empty-state-title">No files uploaded</h3>
                                    <p className="empty-state-description">
                                        Files attached to updates will appear here.
                                    </p>
                                </div>
                            ) : (
                                updates.flatMap(u => u.attachments || []).map((file) => (
                                    <div key={file.id} className="file-item" style={{ flex: '1 1 280px', maxWidth: '320px' }}>
                                        <div className="file-item-icon">
                                            <FileText size={18} />
                                        </div>
                                        <div className="file-item-info">
                                            <div className="file-item-name">{file.name}</div>
                                            <div className="file-item-size">{file.size}</div>
                                        </div>
                                        <button className="btn btn-ghost btn-icon">
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            <PostUpdateModal
                isOpen={showUpdateModal}
                onClose={() => setShowUpdateModal(false)}
                onSubmit={handlePostUpdate}
            />
        </div>
    );
}
