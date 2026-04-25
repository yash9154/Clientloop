import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    ArrowLeft, Plus, Send, X, Trash2, FileText,
    CheckCircle2, Clock, AlertCircle, Paperclip,
    Download, Image, File, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';

// ── HELPERS ───────────────────────────────────────────────────────

const formatDate = (d) => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
const formatTime = (d) => {
    const diff = Date.now()-new Date(d), m=Math.floor(diff/60000), h=Math.floor(m/60), days=Math.floor(h/24);
    if(m<1) return 'Just now'; if(m<60) return `${m}m ago`;
    if(h<24) return `${h}h ago`; if(days===1) return 'Yesterday';
    return formatDate(d);
};

const approvalStyle = {
    none:               { bg:'var(--color-gray-100)',    text:'var(--color-gray-600)',    label:'No Approval Needed'  },
    pending:            { bg:'var(--color-warning-100)', text:'var(--color-warning-700)', label:'Pending Approval'    },
    approved:           { bg:'var(--color-success-100)', text:'var(--color-success-700)', label:'Approved'            },
    'changes-requested':{ bg:'var(--color-error-100)',   text:'var(--color-error-700)',   label:'Changes Requested'   },
};
const typeColor = { progress:'#3b82f6', milestone:'#8b5cf6', delivery:'#10b981' };

function formatBytes(bytes) {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024*1024) return `${(bytes/1024).toFixed(1)} KB`;
    return `${(bytes/1024/1024).toFixed(1)} MB`;
}

// ── POST UPDATE MODAL ─────────────────────────────────────────────

function PostUpdateModal({ isOpen, onClose, projectId, onCreated }) {
    const { addUpdate } = useData();
    const [form,    setForm]    = useState({ title:'', content:'', type:'progress', requiresApproval:false });
    const [files,   setFiles]   = useState([]);
    const [saving,  setSaving]  = useState(false);
    const [error,   setError]   = useState('');
    const fileRef = useRef(null);

    if (!isOpen) return null;
    const set = f => e => setForm(p=>({...p,[f]:e.target.value}));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const update = await addUpdate({ ...form, projectId }, files);
            onCreated(update);
            setForm({ title:'', content:'', type:'progress', requiresApproval:false });
            setFiles([]); onClose();
        } catch(err) { setError(err.message||'Failed to post update'); }
        finally { setSaving(false); }
    };

    const removeFile = (idx) => setFiles(prev => prev.filter((_,i)=>i!==idx));

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Post Update</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                        {error && <div style={{padding:'var(--space-3)',background:'var(--color-error-50)',border:'1px solid var(--color-error-100)',borderRadius:'var(--radius-lg)',color:'var(--color-error-600)',fontSize:'var(--font-size-sm)'}}>{error}</div>}

                        <div className="form-group">
                            <label className="form-label required">Title</label>
                            <input className="form-input" placeholder="e.g. Homepage design completed" value={form.title} onChange={set('title')} required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label required">Content</label>
                            <textarea className="form-input form-textarea" placeholder="Describe the update..." value={form.content} onChange={set('content')} rows={4} required/>
                        </div>

                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
                            <div className="form-group">
                                <label className="form-label">Update Type</label>
                                <select className="form-input form-select" value={form.type} onChange={set('type')}>
                                    <option value="progress">Progress</option>
                                    <option value="milestone">Milestone</option>
                                    <option value="delivery">Delivery</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Requires Approval?</label>
                                <label style={{display:'flex',alignItems:'center',gap:'var(--space-2)',cursor:'pointer',marginTop:'var(--space-2)'}}>
                                    <input type="checkbox" checked={form.requiresApproval} onChange={e=>setForm(p=>({...p,requiresApproval:e.target.checked}))}/>
                                    <span style={{fontSize:'var(--font-size-sm)'}}>Ask client to approve</span>
                                </label>
                            </div>
                        </div>

                        {/* File upload */}
                        <div>
                            <label className="form-label" style={{marginBottom:'var(--space-2)'}}>Attachments</label>
                            <div
                                style={{border:'2px dashed var(--border-medium)',borderRadius:'var(--radius-lg)',padding:'var(--space-4)',textAlign:'center',cursor:'pointer',background:'var(--bg-secondary)'}}
                                onClick={()=>fileRef.current?.click()}
                            >
                                <Paperclip size={20} style={{margin:'0 auto var(--space-2)',color:'var(--text-muted)'}}/>
                                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-tertiary)'}}>Click to attach files</p>
                                <p style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>Images, Videos, PDFs, Word, Excel, PowerPoint, Text — max 50MB each</p>
                            </div>
                            <input ref={fileRef} type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip" style={{display:'none'}} onChange={e=>setFiles(prev=>[...prev,...Array.from(e.target.files)])}/>

                            {files.length > 0 && (
                                <div style={{marginTop:'var(--space-3)',display:'flex',flexDirection:'column',gap:'var(--space-2)'}}>
                                    {files.map((f,i) => (
                                        <div key={i} style={{display:'flex',alignItems:'center',gap:'var(--space-3)',padding:'var(--space-2) var(--space-3)',background:'var(--bg-secondary)',borderRadius:'var(--radius-md)',border:'1px solid var(--border-light)'}}>
                                            <FileText size={16} style={{color:'var(--color-primary-500)',flexShrink:0}}/>
                                            <span style={{flex:1,fontSize:'var(--font-size-sm)',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</span>
                                            <span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatBytes(f.size)}</span>
                                            <button type="button" className="btn btn-ghost btn-icon" style={{width:'24px',height:'24px'}} onClick={()=>removeFile(i)}><X size={12}/></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Posting...' : <><Send size={16}/> Post Update</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── COMMENTS SECTION ──────────────────────────────────────────────

function CommentsSection({ updateId }) {
    const { getCommentsByUpdate, addComment, deleteComment } = useData();
    const { user } = { user: JSON.parse(localStorage.getItem('clientloop_user') || 'null') };
    const [comments,    setComments]    = useState([]);
    const [loading,     setLoading]     = useState(false);
    const [content,     setContent]     = useState('');
    const [submitting,  setSubmitting]  = useState(false);

    // Get user from auth context via a simple import
    const authUser = (() => { try { return JSON.parse(localStorage.getItem('clientloop_user') || 'null'); } catch { return null; } })();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getCommentsByUpdate(updateId);
            setComments(data); setLoading(false);
        };
        fetch();
    }, [updateId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            const comment = await addComment(updateId, content.trim());
            setComments(prev => [...prev, comment]); setContent('');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (commentId) => {
        await deleteComment(commentId);
        setComments(prev => prev.filter(c => c._id !== commentId));
    };

    return (
        <div>
            {loading ? (
                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-tertiary)',padding:'var(--space-4)'}}>Loading comments...</p>
            ) : comments.length === 0 ? (
                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-tertiary)',padding:'var(--space-3) 0'}}>No comments yet. Start the discussion.</p>
            ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)',marginBottom:'var(--space-4)'}}>
                    {comments.map(c => (
                        <div key={c._id} style={{display:'flex',gap:'var(--space-3)'}}>
                            <div className="avatar avatar-sm" style={{background: c.authorRole==='agency'?'var(--color-primary-500)':'var(--color-success-500)',color:'white',flexShrink:0}}>
                                {(c.authorName||'?').charAt(0).toUpperCase()}
                            </div>
                            <div style={{flex:1}}>
                                <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'4px'}}>
                                    <span style={{fontWeight:'var(--font-weight-medium)',fontSize:'var(--font-size-sm)'}}>{c.authorName}</span>
                                    <span style={{fontSize:'10px',padding:'1px 6px',borderRadius:'var(--radius-full)',background:c.authorRole==='agency'?'var(--color-primary-100)':'var(--color-success-100)',color:c.authorRole==='agency'?'var(--color-primary-700)':'var(--color-success-700)',textTransform:'capitalize'}}>{c.authorRole}</span>
                                    <span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatTime(c.createdAt)}</span>
                                </div>
                                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-secondary)',lineHeight:'var(--line-height-relaxed)'}}>{c.content}</p>
                            </div>
                            <button className="btn btn-ghost btn-icon" style={{width:'24px',height:'24px',color:'var(--text-muted)',flexShrink:0}} onClick={()=>handleDelete(c._id)}>
                                <X size={12}/>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{display:'flex',gap:'var(--space-2)'}}>
                <input className="form-input" style={{flex:1}} placeholder="Write a comment..." value={content} onChange={e=>setContent(e.target.value)}/>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting||!content.trim()}>
                    <Send size={14}/>
                </button>
            </form>
        </div>
    );
}

// ── UPDATE CARD ───────────────────────────────────────────────────

function UpdateCard({ update, onDelete }) {
    const [showComments, setShowComments] = useState(false);
    const as = approvalStyle[update.approvalStatus] || approvalStyle.none;
    const tc = typeColor[update.type] || typeColor.progress;

    const fileIcon = (type) => {
        if (type === 'image')       return <Image size={14}/>;
        if (type === 'video')       return <span style={{fontSize:'12px'}}>🎬</span>;
        if (type === 'pdf')         return <span style={{fontSize:'12px'}}>📄</span>;
        if (type === 'document')    return <span style={{fontSize:'12px'}}>📝</span>;
        if (type === 'spreadsheet') return <span style={{fontSize:'12px'}}>📊</span>;
        return <File size={14}/>;
    };

    return (
        <div className="card animate-fade-in-up" style={{border: update.approvalStatus==='changes-requested'?'2px solid var(--color-error-300)':undefined}}>
            <div className="card-body">
                {/* Header */}
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'var(--space-3)',flexWrap:'wrap',gap:'var(--space-2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',flexWrap:'wrap'}}>
                        <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:tc+'20',color:tc,textTransform:'capitalize'}}>{update.type}</span>
                        <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:as.bg,color:as.text}}>{as.label}</span>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)'}}>
                        <span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatTime(update.createdAt)}</span>
                        <button className="btn btn-ghost btn-icon" style={{width:'28px',height:'28px',color:'var(--text-muted)'}} onClick={()=>onDelete(update._id)}>
                            <Trash2 size={14}/>
                        </button>
                    </div>
                </div>

                <h4 style={{fontWeight:'var(--font-weight-semibold)',color:'var(--text-primary)',marginBottom:'var(--space-2)'}}>{update.title}</h4>
                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-secondary)',lineHeight:'var(--line-height-relaxed)',marginBottom:'var(--space-3)'}}>{update.content}</p>

                {/* Files */}
                {update.files && update.files.length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
                        {update.files.map((f,i) => (
                            <a key={i} href={f.url} target="_blank" rel="noreferrer" style={{
                                display:'flex',alignItems:'center',gap:'6px',
                                padding:'4px 10px',borderRadius:'var(--radius-md)',
                                border:'1px solid var(--border-medium)',background:'var(--bg-secondary)',
                                fontSize:'var(--font-size-xs)',color:'var(--text-secondary)',textDecoration:'none',
                                transition:'all var(--transition-fast)'
                            }}
                            onMouseEnter={e=>{e.currentTarget.style.background='var(--color-primary-50)';e.currentTarget.style.borderColor='var(--color-primary-300)';}}
                            onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-secondary)';e.currentTarget.style.borderColor='var(--border-medium)';}}
                            >
                                {fileIcon(f.type)}
                                <span style={{maxWidth:'120px',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.name}</span>
                                <Download size={10}/>
                            </a>
                        ))}
                    </div>
                )}

                {/* Change request note */}
                {update.approvalStatus==='changes-requested' && update.changeRequestNote && (
                    <div style={{padding:'var(--space-3)',background:'var(--color-error-50)',border:'1px solid var(--color-error-100)',borderRadius:'var(--radius-lg)',marginBottom:'var(--space-3)'}}>
                        <p style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-semibold)',color:'var(--color-error-700)',marginBottom:'4px'}}>Client requested changes:</p>
                        <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-error-700)'}}>{update.changeRequestNote}</p>
                    </div>
                )}

                {update.approvalStatus==='approved' && (
                    <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
                        <CheckCircle2 size={14} style={{color:'var(--color-success-600)'}}/>
                        <span style={{fontSize:'var(--font-size-xs)',color:'var(--color-success-700)'}}>
                            Approved by {update.approvedBy} {update.approvedAt?`on ${formatDate(update.approvedAt)}`:''}
                        </span>
                    </div>
                )}

                {/* Comments toggle */}
                <button
                    className="btn btn-ghost btn-sm"
                    onClick={()=>setShowComments(!showComments)}
                    style={{color:'var(--text-tertiary)',marginTop:'var(--space-1)'}}
                >
                    <MessageSquare size={14}/>
                    Discussion
                    {showComments ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                </button>

                {showComments && (
                    <div style={{marginTop:'var(--space-4)',paddingTop:'var(--space-4)',borderTop:'1px solid var(--border-light)'}}>
                        <CommentsSection updateId={update._id}/>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────

export default function ProjectDetailPage() {
    const { projectId } = useParams();
    const { getUpdatesByProject, deleteUpdate } = useData();
    const [project,    setProject]    = useState(null);
    const [updates,    setUpdates]    = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [showPost,   setShowPost]   = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                // Fetch project details
                const token = localStorage.getItem('clientloop_token');
                const res   = await window.fetch(
                    `${import.meta.env.VITE_API_URL||'http://localhost:5000/api'}/projects/${projectId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                if (data.success) setProject(data.project);

                const updatesData = await getUpdatesByProject(projectId);
                setUpdates(updatesData);
            } catch(err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetch();
    }, [projectId]);

    const handleDelete = async (updateId) => {
        if (!window.confirm('Delete this update?')) return;
        await deleteUpdate(updateId);
        setUpdates(prev => prev.filter(u => u._id !== updateId));
    };

    const statusConfig = {
        'in-progress':{ label:'In Progress', bg:'var(--color-info-100)',    text:'var(--color-info-700)'    },
        'review':     { label:'In Review',   bg:'var(--color-warning-100)', text:'var(--color-warning-700)' },
        'completed':  { label:'Completed',   bg:'var(--color-success-100)', text:'var(--color-success-700)' },
    };

    if (loading) return (
        <div style={{textAlign:'center',padding:'var(--space-16)',color:'var(--text-tertiary)'}}>
            <Clock size={32} style={{margin:'0 auto var(--space-3)',opacity:0.4}}/>
            <p>Loading project...</p>
        </div>
    );

    if (!project) return (
        <div className="empty-state">
            <AlertCircle className="empty-state-icon"/>
            <h3 className="empty-state-title">Project not found</h3>
            <Link to="/clients" className="btn btn-primary"><ArrowLeft size={18}/> Back to Clients</Link>
        </div>
    );

    const sc = statusConfig[project.status] || statusConfig['in-progress'];
    const pendingCount = updates.filter(u=>u.approvalStatus==='pending').length;

    return (
        <div>
            {/* Back */}
            <Link to={`/clients/${project.clientId}`} className="btn btn-ghost" style={{marginBottom:'var(--space-4)',marginLeft:'-12px'}}>
                <ArrowLeft size={18}/> Back to {project.clientName||'Client'}
            </Link>

            {/* Project header */}
            <div className="card animate-fade-in-up" style={{marginBottom:'var(--space-6)'}}>
                <div className="card-body">
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:'var(--space-4)'}}>
                        <div>
                            <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',flexWrap:'wrap',marginBottom:'var(--space-2)'}}>
                                <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:'var(--font-weight-bold)',color:'var(--text-primary)'}}>{project.name}</h1>
                                <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'3px 10px',borderRadius:'var(--radius-full)',background:sc.bg,color:sc.text}}>{sc.label}</span>
                            </div>
                            {project.description && <p style={{color:'var(--text-secondary)',fontSize:'var(--font-size-sm)',marginBottom:'var(--space-2)'}}>{project.description}</p>}
                            <p style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>Client: {project.clientName} · Created {formatDate(project.createdAt)}</p>
                        </div>
                        <button className="btn btn-primary" onClick={()=>setShowPost(true)}>
                            <Plus size={18}/> Post Update
                        </button>
                    </div>

                    {/* Mini stats */}
                    <div style={{display:'flex',gap:'var(--space-6)',marginTop:'var(--space-4)',paddingTop:'var(--space-4)',borderTop:'1px solid var(--border-light)',flexWrap:'wrap'}}>
                        {[
                            ['Total Updates',     updates.length,  'var(--text-primary)' ],
                            ['Pending Approval',  pendingCount,    pendingCount>0?'var(--color-warning-600)':'var(--text-primary)'],
                            ['Approved',          updates.filter(u=>u.approvalStatus==='approved').length, 'var(--color-success-600)'],
                        ].map(([label,val,color])=>(
                            <div key={label}>
                                <div style={{fontSize:'var(--font-size-xl)',fontWeight:'var(--font-weight-bold)',color}}>{val}</div>
                                <div style={{fontSize:'var(--font-size-xs)',color:'var(--text-tertiary)'}}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Updates */}
            {updates.length === 0 ? (
                <div style={{textAlign:'center',padding:'var(--space-12)',color:'var(--text-tertiary)'}}>
                    <FileText size={40} style={{margin:'0 auto var(--space-3)',opacity:0.3}}/>
                    <h3 style={{fontWeight:'var(--font-weight-semibold)',marginBottom:'var(--space-2)'}}>No updates yet</h3>
                    <p style={{fontSize:'var(--font-size-sm)',marginBottom:'var(--space-4)'}}>Post your first update to keep the client informed.</p>
                    <button className="btn btn-primary" onClick={()=>setShowPost(true)}><Plus size={16}/> Post First Update</button>
                </div>
            ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                    {updates.map((update,i) => (
                        <div key={update._id} style={{animationDelay:`${i*0.04}s`}}>
                            <UpdateCard update={update} onDelete={handleDelete}/>
                        </div>
                    ))}
                </div>
            )}

            <PostUpdateModal
                isOpen={showPost}
                onClose={()=>setShowPost(false)}
                projectId={projectId}
                onCreated={u=>setUpdates(prev=>[u,...prev])}
            />
        </div>
    );
}