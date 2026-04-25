import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    FolderOpen, FileText, CheckCircle2, Clock,
    AlertCircle, ThumbsUp, MessageSquare, ChevronDown, ChevronUp,
    Send, X
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
    pending:            { bg:'var(--color-warning-100)', text:'var(--color-warning-700)', label:'Awaiting Your Approval'},
    approved:           { bg:'var(--color-success-100)', text:'var(--color-success-700)', label:'Approved'            },
    'changes-requested':{ bg:'var(--color-error-100)',   text:'var(--color-error-700)',   label:'Changes Requested'   },
};

// ── COMMENTS ─────────────────────────────────────────────────────

function CommentsSection({ updateId }) {
    const { getCommentsByUpdate, addComment } = useData();
    const [comments,   setComments]   = useState([]);
    const [content,    setContent]    = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        getCommentsByUpdate(updateId).then(setComments);
    }, [updateId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            const c = await addComment(updateId, content.trim());
            setComments(prev=>[...prev,c]); setContent('');
        } finally { setSubmitting(false); }
    };

    return (
        <div style={{marginTop:'var(--space-4)',paddingTop:'var(--space-4)',borderTop:'1px solid var(--border-light)'}}>
            {comments.length > 0 && (
                <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)',marginBottom:'var(--space-3)'}}>
                    {comments.map(c=>(
                        <div key={c._id} style={{display:'flex',gap:'var(--space-3)'}}>
                            <div className="avatar avatar-sm" style={{background:c.authorRole==='agency'?'var(--color-primary-500)':'var(--color-success-500)',color:'white',flexShrink:0}}>
                                {(c.authorName||'?').charAt(0)}
                            </div>
                            <div style={{flex:1}}>
                                <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'4px'}}>
                                    <span style={{fontWeight:'var(--font-weight-medium)',fontSize:'var(--font-size-sm)'}}>{c.authorName}</span>
                                    <span style={{fontSize:'10px',padding:'1px 6px',borderRadius:'var(--radius-full)',background:c.authorRole==='agency'?'var(--color-primary-100)':'var(--color-success-100)',color:c.authorRole==='agency'?'var(--color-primary-700)':'var(--color-success-700)',textTransform:'capitalize'}}>{c.authorRole}</span>
                                    <span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatTime(c.createdAt)}</span>
                                </div>
                                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-secondary)'}}>{c.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{display:'flex',gap:'var(--space-2)'}}>
                <input className="form-input" style={{flex:1}} placeholder="Reply to this update..." value={content} onChange={e=>setContent(e.target.value)}/>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting||!content.trim()}><Send size={14}/></button>
            </form>
        </div>
    );
}

// ── UPDATE CARD ───────────────────────────────────────────────────

function UpdateCard({ update, onApprove, onRequestChanges }) {
    const [showChangeInput, setShowChangeInput] = useState(false);
    const [changeNote,      setChangeNote]      = useState('');
    const [showComments,    setShowComments]    = useState(false);
    const [loading,         setLoading]         = useState(false);
    const as = approvalStyle[update.approvalStatus] || approvalStyle.none;
    const tc = { progress:'#3b82f6', milestone:'#8b5cf6', delivery:'#10b981' }[update.type] || '#3b82f6';

    const handleApprove = async () => {
        setLoading(true);
        try { await onApprove(update._id); } finally { setLoading(false); }
    };

    const handleRequestChanges = async () => {
        if (!changeNote.trim()) return;
        setLoading(true);
        try {
            await onRequestChanges(update._id, changeNote);
            setShowChangeInput(false); setChangeNote('');
        } finally { setLoading(false); }
    };

    return (
        <div className="card animate-fade-in-up" style={{border:update.approvalStatus==='pending'?'2px solid var(--color-warning-300)':undefined}}>
            <div className="card-body">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'var(--space-3)',flexWrap:'wrap',gap:'var(--space-2)'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',flexWrap:'wrap'}}>
                        <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:tc+'20',color:tc,textTransform:'capitalize'}}>{update.type}</span>
                        <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:as.bg,color:as.text}}>{as.label}</span>
                    </div>
                    <span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatTime(update.createdAt)}</span>
                </div>

                <h4 style={{fontWeight:'var(--font-weight-semibold)',marginBottom:'var(--space-2)'}}>{update.title}</h4>
                <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-secondary)',lineHeight:'var(--line-height-relaxed)',marginBottom:'var(--space-3)'}}>{update.content}</p>

                {/* Files */}
                {update.files && update.files.length > 0 && (
                    <div style={{display:'flex',flexWrap:'wrap',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
                        {update.files.map((f,i) => (
                            <a key={i} href={f.url} target="_blank" rel="noreferrer" style={{
                                display:'flex',alignItems:'center',gap:'6px',padding:'4px 10px',
                                borderRadius:'var(--radius-md)',border:'1px solid var(--border-medium)',
                                background:'var(--bg-secondary)',fontSize:'var(--font-size-xs)',
                                color:'var(--text-secondary)',textDecoration:'none'
                            }}>
                                <FileText size={12}/> {f.name}
                            </a>
                        ))}
                    </div>
                )}

                {update.approvalStatus==='changes-requested' && update.changeRequestNote && (
                    <div style={{padding:'var(--space-3)',background:'var(--color-error-50)',border:'1px solid var(--color-error-100)',borderRadius:'var(--radius-lg)',marginBottom:'var(--space-3)'}}>
                        <p style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-semibold)',color:'var(--color-error-700)',marginBottom:'4px'}}>Your change request:</p>
                        <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-error-700)'}}>{update.changeRequestNote}</p>
                    </div>
                )}

                {update.approvalStatus==='approved' && (
                    <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-3)'}}>
                        <CheckCircle2 size={14} style={{color:'var(--color-success-600)'}}/>
                        <span style={{fontSize:'var(--font-size-xs)',color:'var(--color-success-700)'}}>
                            Approved {update.approvedAt?`on ${formatDate(update.approvedAt)}`:''}
                        </span>
                    </div>
                )}

                {/* Approval actions */}
                {update.approvalStatus==='pending' && (
                    <div style={{marginBottom:'var(--space-3)'}}>
                        {!showChangeInput ? (
                            <div style={{display:'flex',gap:'var(--space-3)',flexWrap:'wrap'}}>
                                <button className="btn btn-success" onClick={handleApprove} disabled={loading} style={{flex:1}}>
                                    <ThumbsUp size={16}/> {loading?'Approving...':'Approve'}
                                </button>
                                <button className="btn btn-secondary" onClick={()=>setShowChangeInput(true)} disabled={loading} style={{flex:1}}>
                                    <MessageSquare size={16}/> Request Changes
                                </button>
                            </div>
                        ) : (
                            <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
                                <textarea className="form-input form-textarea" placeholder="Describe the changes needed..." value={changeNote} onChange={e=>setChangeNote(e.target.value)} rows={3}/>
                                <div style={{display:'flex',gap:'var(--space-2)'}}>
                                    <button className="btn btn-secondary btn-sm" onClick={()=>{setShowChangeInput(false);setChangeNote('');}}>Cancel</button>
                                    <button className="btn btn-primary btn-sm" onClick={handleRequestChanges} disabled={loading||!changeNote.trim()}>
                                        {loading?'Sending...':'Send Request'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Comments toggle */}
                <button className="btn btn-ghost btn-sm" onClick={()=>setShowComments(!showComments)} style={{color:'var(--text-tertiary)'}}>
                    <MessageSquare size={14}/> Discussion {showComments?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                </button>

                {showComments && <CommentsSection updateId={update._id}/>}
            </div>
        </div>
    );
}

// ── PROJECT SECTION ───────────────────────────────────────────────

function ProjectSection({ project }) {
    const { getUpdatesByProjectForClient, approveUpdate, requestChanges } = useData();
    const [updates,    setUpdates]    = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [expanded,   setExpanded]   = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await getUpdatesByProjectForClient(project._id);
            setUpdates(data); setLoading(false);
        };
        fetch();
    }, [project._id]);

    const pendingCount = updates.filter(u=>u.approvalStatus==='pending').length;

    const statusConfig = {
        'in-progress':{ label:'In Progress', bg:'var(--color-info-100)',    text:'var(--color-info-700)'    },
        'review':     { label:'In Review',   bg:'var(--color-warning-100)', text:'var(--color-warning-700)' },
        'completed':  { label:'Completed',   bg:'var(--color-success-100)', text:'var(--color-success-700)' },
    };
    const sc = statusConfig[project.status] || statusConfig['in-progress'];

    const handleApprove = async (updateId) => {
        const updated = await approveUpdate(updateId);
        setUpdates(prev=>prev.map(u=>u._id===updateId?updated:u));
    };

    const handleRequestChanges = async (updateId, note) => {
        const updated = await requestChanges(updateId, note);
        setUpdates(prev=>prev.map(u=>u._id===updateId?updated:u));
    };

    return (
        <div className="card" style={{marginBottom:'var(--space-4)'}}>
            {/* Project header */}
            <div
                className="card-header"
                style={{display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer'}}
                onClick={()=>setExpanded(!expanded)}
            >
                <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)'}}>
                    <FolderOpen size={18} style={{color:'var(--color-primary-500)'}}/>
                    <div>
                        <div style={{fontWeight:'var(--font-weight-semibold)'}}>{project.name}</div>
                        {project.description && <div style={{fontSize:'var(--font-size-xs)',color:'var(--text-tertiary)'}}>{project.description}</div>}
                    </div>
                    <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:sc.bg,color:sc.text}}>{sc.label}</span>
                    {pendingCount>0 && <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-semibold)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:'var(--color-warning-100)',color:'var(--color-warning-700)'}}>⚡ {pendingCount} pending</span>}
                </div>
                {expanded?<ChevronUp size={18} style={{color:'var(--text-muted)'}}/>:<ChevronDown size={18} style={{color:'var(--text-muted)'}}/>}
            </div>

            {expanded && (
                <div style={{padding:'var(--space-4)'}}>
                    {loading ? (
                        <p style={{color:'var(--text-tertiary)',fontSize:'var(--font-size-sm)'}}>Loading updates...</p>
                    ) : updates.length===0 ? (
                        <div style={{textAlign:'center',padding:'var(--space-6)',color:'var(--text-tertiary)'}}>
                            <FileText size={28} style={{margin:'0 auto var(--space-2)',opacity:0.3}}/>
                            <p style={{fontSize:'var(--font-size-sm)'}}>No updates yet for this project.</p>
                        </div>
                    ) : (
                        <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
                            {updates.map(update=>(
                                <UpdateCard
                                    key={update._id}
                                    update={update}
                                    onApprove={handleApprove}
                                    onRequestChanges={handleRequestChanges}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ── MAIN ──────────────────────────────────────────────────────────

export default function ClientDashboard() {
    const { getMyProjects } = useData();
    const { user }          = useAuth();
    const [projects,  setProjects]  = useState([]);
    const [loading,   setLoading]   = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getMyProjects();
            setProjects(data); setLoading(false);
        };
        fetch();
    }, []);

    return (
        <div style={{maxWidth:'860px',margin:'0 auto',padding:'var(--space-6)'}}>
            <div style={{marginBottom:'var(--space-6)'}}>
                <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:'var(--font-weight-bold)',marginBottom:'var(--space-1)'}}>
                    Hello, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{color:'var(--text-tertiary)'}}>Here are your projects and updates from your agency.</p>
            </div>

            {loading ? (
                <div style={{textAlign:'center',padding:'var(--space-12)',color:'var(--text-tertiary)'}}>
                    <Clock size={32} style={{margin:'0 auto var(--space-3)',opacity:0.4}}/>
                    <p>Loading your projects...</p>
                </div>
            ) : projects.length===0 ? (
                <div style={{textAlign:'center',padding:'var(--space-12)',color:'var(--text-tertiary)'}}>
                    <FolderOpen size={40} style={{margin:'0 auto var(--space-3)',opacity:0.3}}/>
                    <h3 style={{fontWeight:'var(--font-weight-semibold)',marginBottom:'var(--space-2)'}}>No projects yet</h3>
                    <p style={{fontSize:'var(--font-size-sm)'}}>Your agency will create projects for you here.</p>
                </div>
            ) : (
                projects.map(project=>(
                    <ProjectSection key={project._id} project={project}/>
                ))
            )}
        </div>
    );
}