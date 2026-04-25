import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import {
    ArrowLeft, Mail, Phone, Calendar, Edit2, Trash2,
    X, Save, Key, Plus, FolderOpen, StickyNote,
    AlertCircle, CalendarCheck, Building2
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
const getGradient  = (name) => GRADIENTS[(name||'A').charCodeAt(0) % GRADIENTS.length];
const getInitials  = (name) => (name||'??').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
const formatDate   = (d) => new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});

const NOTE_TYPES = [
    { value:'note',      label:'Note',      color:'#6366f1' },
    { value:'call',      label:'Call',      color:'#10b981' },
    { value:'email',     label:'Email',     color:'#3b82f6' },
    { value:'meeting',   label:'Meeting',   color:'#f59e0b' },
    { value:'proposal',  label:'Proposal',  color:'#8b5cf6' },
    { value:'follow-up', label:'Follow-up', color:'#ec4899' },
];
const getNoteType = (val) => NOTE_TYPES.find(t=>t.value===val) || NOTE_TYPES[0];

const formatTime = (d) => {
    const diff = Date.now() - new Date(d);
    const m = Math.floor(diff/60000), h = Math.floor(m/60), days = Math.floor(h/24);
    if (m<1) return 'Just now';
    if (m<60) return `${m}m ago`;
    if (h<24) return `${h}h ago`;
    if (days===1) return 'Yesterday';
    return formatDate(d);
};

// ── EDIT CLIENT MODAL ─────────────────────────────────────────────

function EditClientModal({ isOpen, onClose, client, onSave }) {
    const [form, setForm] = useState({
        name:'', email:'', contactName:'', phone:'',
        company:'', industry:'', status:'active', followUpDate:'', password:''
    });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState('');

    useEffect(() => {
        if (client) setForm({
            name:        client.name        || '',
            email:       client.email       || '',
            contactName: client.contactName || '',
            phone:       client.phone       || '',
            company:     client.company     || '',
            industry:    client.industry    || '',
            status:      client.status      || 'active',
            followUpDate: client.followUpDate ? new Date(client.followUpDate).toISOString().split('T')[0] : '',
            password: ''
        });
    }, [client]);

    if (!isOpen) return null;
    const set = f => e => setForm(p => ({...p,[f]:e.target.value}));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const payload = {...form};
            if (!payload.password.trim()) delete payload.password;
            if (!payload.followUpDate)    delete payload.followUpDate;
            await onSave(payload); onClose();
        } catch(err) { setError(err.message||'Failed to save'); }
        finally { setSaving(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">Edit Client</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                        {error && <div style={{padding:'var(--space-3)',background:'var(--color-error-50)',border:'1px solid var(--color-error-100)',borderRadius:'var(--radius-lg)',color:'var(--color-error-600)',fontSize:'var(--font-size-sm)'}}>{error}</div>}
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'var(--space-4)'}}>
                            {[['name','Client Name',true],['email','Email',true],['contactName','Contact Person'],['phone','Phone'],['company','Company'],['industry','Industry']].map(([f,label,req])=>(
                                <div key={f} className="form-group">
                                    <label className={`form-label${req?' required':''}`}>{label}</label>
                                    <input className="form-input" type={f==='email'?'email':'text'} value={form[f]} onChange={set(f)} required={!!req}/>
                                </div>
                            ))}
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
                                <input className="form-input" type="date" value={form.followUpDate} onChange={set('followUpDate')}/>
                            </div>
                        </div>
                        <div style={{padding:'var(--space-4)',background:'var(--bg-secondary)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border-light)'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',marginBottom:'var(--space-2)',fontWeight:'var(--font-weight-semibold)'}}>
                                <Key size={15}/> Update Portal Password
                            </div>
                            <p className="form-helper" style={{marginBottom:'var(--space-3)'}}>Leave blank to keep current password.</p>
                            <input className="form-input" type="text" placeholder="New password (min 6 chars)" value={form.password} onChange={set('password')}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Saving...' : <><Save size={16}/> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── ADD PROJECT MODAL ─────────────────────────────────────────────

function AddProjectModal({ isOpen, onClose, clientId, onCreated }) {
    const { addProject } = useData();
    const [form, setForm] = useState({ name:'', description:'' });
    const [saving, setSaving] = useState(false);
    const [error,  setError]  = useState('');

    if (!isOpen) return null;
    const set = f => e => setForm(p=>({...p,[f]:e.target.value}));

    const handleSubmit = async (e) => {
        e.preventDefault(); setSaving(true); setError('');
        try {
            const project = await addProject({ ...form, clientId });
            onCreated(project);
            setForm({ name:'', description:'' }); onClose();
        } catch(err) { setError(err.message||'Failed to create project'); }
        finally { setSaving(false); }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={e=>e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-title">New Project</h2>
                    <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                        {error && <div style={{padding:'var(--space-3)',background:'var(--color-error-50)',border:'1px solid var(--color-error-100)',borderRadius:'var(--radius-lg)',color:'var(--color-error-600)',fontSize:'var(--font-size-sm)'}}>{error}</div>}
                        <div className="form-group">
                            <label className="form-label required">Project Name</label>
                            <input className="form-input" placeholder="e.g. Website Redesign" value={form.name} onChange={set('name')} required/>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <textarea className="form-input form-textarea" placeholder="Brief project description..." value={form.description} onChange={set('description')} rows={3}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Creating...' : <><Plus size={16}/> Create Project</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── PROJECTS TAB ──────────────────────────────────────────────────

function ProjectsTab({ clientId }) {
    const { getProjectsByClient, updateProject, deleteProject } = useData();
    const [projects,  setProjects]  = useState([]);
    const [loading,   setLoading]   = useState(true);
    const [showAdd,   setShowAdd]   = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getProjectsByClient(clientId);
            setProjects(data); setLoading(false);
        };
        fetch();
    }, [clientId]);

    const statusConfig = {
        'in-progress': { label:'In Progress', bg:'var(--color-info-100)',    text:'var(--color-info-700)'    },
        'review':      { label:'In Review',   bg:'var(--color-warning-100)', text:'var(--color-warning-700)' },
        'completed':   { label:'Completed',   bg:'var(--color-success-100)', text:'var(--color-success-700)' },
    };

    const handleStatusChange = async (projectId, status) => {
        const updated = await updateProject(projectId, { status });
        setProjects(prev => prev.map(p => p._id === projectId ? updated : p));
    };

    const handleDelete = async (projectId) => {
        if (!window.confirm('Delete this project and all its updates?')) return;
        await deleteProject(projectId);
        setProjects(prev => prev.filter(p => p._id !== projectId));
    };

    return (
        <div>
            <div style={{display:'flex',justifyContent:'flex-end',marginBottom:'var(--space-4)'}}>
                <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}>
                    <Plus size={15}/> New Project
                </button>
            </div>

            {loading ? (
                <div style={{textAlign:'center',padding:'var(--space-10)',color:'var(--text-tertiary)'}}>Loading projects...</div>
            ) : projects.length === 0 ? (
                <div style={{textAlign:'center',padding:'var(--space-10)',color:'var(--text-tertiary)'}}>
                    <FolderOpen size={36} style={{margin:'0 auto var(--space-3)',opacity:0.3}}/>
                    <p style={{fontWeight:'var(--font-weight-medium)',marginBottom:'var(--space-1)'}}>No projects yet</p>
                    <p style={{fontSize:'var(--font-size-sm)',marginBottom:'var(--space-4)'}}>Create your first project for this client.</p>
                    <button className="btn btn-primary btn-sm" onClick={()=>setShowAdd(true)}><Plus size={14}/> Create Project</button>
                </div>
            ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
                    {projects.map(project => {
                        const sc = statusConfig[project.status] || statusConfig['in-progress'];
                        return (
                            <div key={project._id} className="card animate-fade-in-up">
                                <div className="card-body" style={{display:'flex',alignItems:'center',gap:'var(--space-4)',flexWrap:'wrap'}}>
                                    <div style={{flex:1,minWidth:'200px'}}>
                                        <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',marginBottom:'var(--space-1)'}}>
                                            <h3 style={{fontWeight:'var(--font-weight-semibold)',color:'var(--text-primary)'}}>
                                                {project.name}
                                            </h3>
                                            <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'2px 10px',borderRadius:'var(--radius-full)',background:sc.bg,color:sc.text}}>
                                                {sc.label}
                                            </span>
                                        </div>
                                        {project.description && (
                                            <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-tertiary)'}}>{project.description}</p>
                                        )}
                                        <p style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)',marginTop:'var(--space-1)'}}>
                                            Created {formatDate(project.createdAt)}
                                        </p>
                                    </div>
                                    <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',flexShrink:0}}>
                                        <select
                                            className="form-input form-select"
                                            style={{fontSize:'var(--font-size-xs)',padding:'var(--space-2) var(--space-6) var(--space-2) var(--space-3)',height:'36px'}}
                                            value={project.status}
                                            onChange={e=>handleStatusChange(project._id,e.target.value)}
                                        >
                                            <option value="in-progress">In Progress</option>
                                            <option value="review">In Review</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <Link to={`/projects/${project._id}`} className="btn btn-primary btn-sm">
                                            Open
                                        </Link>
                                        <button className="btn btn-ghost btn-icon" style={{color:'var(--color-error-500)'}} onClick={()=>handleDelete(project._id)}>
                                            <Trash2 size={15}/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddProjectModal
                isOpen={showAdd}
                onClose={()=>setShowAdd(false)}
                clientId={clientId}
                onCreated={p=>setProjects(prev=>[p,...prev])}
            />
        </div>
    );
}

// ── NOTES TIMELINE ────────────────────────────────────────────────

function NotesTab({ clientId }) {
    const { getNotesByClient, addNote, deleteNote } = useData();
    const [notes,      setNotes]      = useState([]);
    const [loading,    setLoading]    = useState(true);
    const [content,    setContent]    = useState('');
    const [noteType,   setNoteType]   = useState('note');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getNotesByClient(clientId);
            setNotes(data); setLoading(false);
        };
        fetch();
    }, [clientId]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        setSubmitting(true);
        try {
            const note = await addNote({ clientId, content: content.trim(), type: noteType });
            setNotes(prev => [note, ...prev]); setContent('');
        } finally { setSubmitting(false); }
    };

    const handleDelete = async (noteId) => {
        await deleteNote(noteId);
        setNotes(prev => prev.filter(n => n._id !== noteId));
    };

    return (
        <div>
            {/* Add note */}
            <form onSubmit={handleAdd} style={{marginBottom:'var(--space-5)'}}>
                <div className="card">
                    <div className="card-body" style={{display:'flex',flexDirection:'column',gap:'var(--space-3)'}}>
                        <div style={{display:'flex',gap:'var(--space-2)',flexWrap:'wrap'}}>
                            {NOTE_TYPES.map(t => (
                                <button key={t.value} type="button" onClick={()=>setNoteType(t.value)} style={{
                                    display:'flex',alignItems:'center',gap:'6px',
                                    padding:'4px 12px',borderRadius:'var(--radius-full)',
                                    fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',
                                    cursor:'pointer',border:'none',
                                    background: noteType===t.value ? t.color : 'var(--bg-tertiary)',
                                    color: noteType===t.value ? 'white' : 'var(--text-secondary)',
                                    transition:'all var(--transition-fast)'
                                }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                        <textarea className="form-input form-textarea" placeholder="Log a call, meeting, email..." value={content} onChange={e=>setContent(e.target.value)} rows={2} style={{resize:'none'}}/>
                        <div style={{display:'flex',justifyContent:'flex-end'}}>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={submitting||!content.trim()}>
                                {submitting ? 'Adding...' : <><Plus size={14}/> Add Note</>}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Timeline */}
            {loading ? (
                <div style={{textAlign:'center',padding:'var(--space-8)',color:'var(--text-tertiary)'}}>Loading...</div>
            ) : notes.length === 0 ? (
                <div style={{textAlign:'center',padding:'var(--space-10)',color:'var(--text-tertiary)'}}>
                    <StickyNote size={36} style={{margin:'0 auto var(--space-3)',opacity:0.3}}/>
                    <p>No notes yet. Log your first interaction above.</p>
                </div>
            ) : (
                <div style={{position:'relative'}}>
                    <div style={{position:'absolute',left:'19px',top:'24px',bottom:0,width:'2px',background:'var(--border-light)'}}/>
                    <div style={{display:'flex',flexDirection:'column',gap:'var(--space-4)'}}>
                        {notes.map((note,i) => {
                            const nt = getNoteType(note.type);
                            return (
                                <div key={note._id} className="animate-fade-in-up" style={{display:'flex',gap:'var(--space-4)',position:'relative',animationDelay:`${i*0.04}s`}}>
                                    <div style={{width:'40px',height:'40px',borderRadius:'50%',background:nt.color,color:'white',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,zIndex:1,boxShadow:'0 0 0 4px white',fontSize:'var(--font-size-sm)',fontWeight:'bold'}}>
                                        {nt.label[0]}
                                    </div>
                                    <div className="card" style={{flex:1}}>
                                        <div className="card-body" style={{padding:'var(--space-4)'}}>
                                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'var(--space-2)'}}>
                                                <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)'}}>
                                                    <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-semibold)',padding:'2px 8px',borderRadius:'var(--radius-full)',background:nt.color+'20',color:nt.color}}>{nt.label}</span>
                                                    <span style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{formatTime(note.createdAt)}</span>
                                                </div>
                                                <button className="btn btn-ghost btn-icon" style={{width:'28px',height:'28px',color:'var(--text-muted)'}} onClick={()=>handleDelete(note._id)}>
                                                    <X size={14}/>
                                                </button>
                                            </div>
                                            <p style={{fontSize:'var(--font-size-sm)',color:'var(--text-secondary)',lineHeight:'var(--line-height-relaxed)'}}>{note.content}</p>
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

// ── MAIN PAGE ─────────────────────────────────────────────────────

export default function ClientDetailPage() {
    const { clientId } = useParams();
    const navigate     = useNavigate();
    const { clients, updateClient, deleteClient, getProjectsByClient, getNotesByClient } = useData();
    const [showEdit,     setShowEdit]     = useState(false);
    const [activeTab,    setActiveTab]    = useState('projects');
    const [projectCount, setProjectCount] = useState('—');
    const [noteCount,    setNoteCount]    = useState('—');

    const client = clients.find(c => c._id === clientId);

    useEffect(() => {
        if (!clientId) return;
        getProjectsByClient(clientId).then(p => setProjectCount(p.length)).catch(() => {});
        getNotesByClient(clientId).then(n => setNoteCount(n.length)).catch(() => {});
    }, [clientId]);

    if (!client) return (
        <div className="empty-state">
            <AlertCircle className="empty-state-icon"/>
            <h3 className="empty-state-title">Client not found</h3>
            <Link to="/clients" className="btn btn-primary"><ArrowLeft size={18}/> Back to Clients</Link>
        </div>
    );

    const statusStyle = {
        active:   { bg:'var(--color-success-100)', text:'var(--color-success-700)' },
        inactive: { bg:'var(--color-gray-100)',     text:'var(--color-gray-600)'   },
        lead:     { bg:'var(--color-info-100)',     text:'var(--color-info-600)'   },
    }[client.status] || {};

    const isOverdue = client.followUpDate && new Date(client.followUpDate) <= new Date();

    const handleSave   = async (data) => { await updateClient(client._id, data); };
    const handleDelete = async () => {
        if (!window.confirm('Delete this client and all their data?')) return;
        await deleteClient(client._id); navigate('/clients');
    };

    const tabs = [
        { key:'projects', label:'Projects',        icon:FolderOpen  },
        { key:'notes',    label:'Notes & Activity', icon:StickyNote  },
    ];

    return (
        <div>
            <Link to="/clients" className="btn btn-ghost" style={{marginBottom:'var(--space-4)',marginLeft:'-12px'}}>
                <ArrowLeft size={18}/> Back to Clients
            </Link>

            {/* Header card */}
            <div className="card animate-fade-in-up" style={{marginBottom:'var(--space-6)'}}>
                <div className="card-body">
                    <div style={{display:'flex',gap:'var(--space-5)',flexWrap:'wrap',alignItems:'flex-start'}}>
                        <div className="avatar avatar-xl" style={{background:getGradient(client.name),color:'white',fontSize:'var(--font-size-2xl)',flexShrink:0}}>
                            {getInitials(client.name)}
                        </div>
                        <div style={{flex:1,minWidth:'200px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'var(--space-3)',flexWrap:'wrap',marginBottom:'var(--space-1)'}}>
                                <h1 style={{fontSize:'var(--font-size-2xl)',fontWeight:'var(--font-weight-bold)',color:'var(--text-primary)'}}>{client.name}</h1>
                                <span style={{fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)',padding:'3px 10px',borderRadius:'var(--radius-full)',background:statusStyle.bg,color:statusStyle.text,textTransform:'capitalize'}}>{client.status}</span>
                            </div>
                            {client.contactName && (
                                <p style={{color:'var(--text-secondary)',marginBottom:'var(--space-3)',fontSize:'var(--font-size-sm)'}}>
                                    {client.contactName}{client.company?` · ${client.company}`:''}{client.industry?` · ${client.industry}`:''}
                                </p>
                            )}
                            <div style={{display:'flex',gap:'var(--space-5)',flexWrap:'wrap'}}>
                                <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--text-tertiary)',fontSize:'var(--font-size-sm)'}}><Mail size={14}/>{client.email}</div>
                                {client.phone && <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--text-tertiary)',fontSize:'var(--font-size-sm)'}}><Phone size={14}/>{client.phone}</div>}
                                <div style={{display:'flex',alignItems:'center',gap:'var(--space-2)',color:'var(--text-tertiary)',fontSize:'var(--font-size-sm)'}}><Calendar size={14}/>Since {formatDate(client.createdAt)}</div>
                            </div>
                            {client.followUpDate && (
                                <div style={{marginTop:'var(--space-3)',display:'inline-flex',alignItems:'center',gap:'var(--space-2)',padding:'4px 12px',borderRadius:'var(--radius-full)',background:isOverdue?'var(--color-error-100)':'var(--color-warning-100)',color:isOverdue?'var(--color-error-700)':'var(--color-warning-700)',fontSize:'var(--font-size-xs)',fontWeight:'var(--font-weight-medium)'}}>
                                    <CalendarCheck size={13}/>
                                    {isOverdue?'Follow-up overdue · ':'Follow-up · '}{formatDate(client.followUpDate)}
                                </div>
                            )}
                        </div>
                        <div style={{display:'flex',gap:'var(--space-2)',flexShrink:0}}>
                            <button className="btn btn-secondary btn-sm" onClick={()=>setShowEdit(true)}><Edit2 size={15}/> Edit</button>
                            <button className="btn btn-ghost btn-sm" style={{color:'var(--color-error-600)'}} onClick={handleDelete}><Trash2 size={15}/></button>
                        </div>
                    </div>
                </div>
            </div>


            {/* Stats strip */}
            <div style={{display:'flex',gap:'var(--space-6)',padding:'var(--space-4) var(--space-6)',marginBottom:'var(--space-4)',background:'white',borderRadius:'var(--radius-xl)',border:'1px solid var(--border-light)'}}>
                {[
                    { label:'Projects',    value: projectCount, color:'var(--color-primary-600)' },
                    { label:'Notes Logged', value: noteCount,    color:'var(--color-info-600)'   },
                    { label:'Status',      value: client.status.charAt(0).toUpperCase()+client.status.slice(1), color: client.status==='active'?'var(--color-success-600)':client.status==='lead'?'var(--color-info-600)':'var(--color-gray-500)' },
                    { label:'Member Since', value: new Date(client.createdAt).toLocaleDateString('en-US',{month:'short',year:'numeric'}), color:'var(--text-secondary)' },
                ].map(s => (
                    <div key={s.label} style={{textAlign:'center'}}>
                        <div style={{fontSize:'var(--font-size-xl)',fontWeight:'var(--font-weight-bold)',color:s.color}}>{s.value}</div>
                        <div style={{fontSize:'var(--font-size-xs)',color:'var(--text-muted)'}}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{display:'flex',gap:0,marginBottom:'var(--space-6)',borderBottom:'2px solid var(--border-light)'}}>
                {tabs.map(tab => (
                    <button key={tab.key} onClick={()=>setActiveTab(tab.key)} style={{
                        display:'flex',alignItems:'center',gap:'var(--space-2)',
                        padding:'var(--space-3) var(--space-5)',background:'none',border:'none',cursor:'pointer',
                        fontSize:'var(--font-size-sm)',fontWeight:'var(--font-weight-medium)',
                        color: activeTab===tab.key ? 'var(--color-primary-600)' : 'var(--text-tertiary)',
                        borderBottom: activeTab===tab.key ? '2px solid var(--color-primary-600)' : '2px solid transparent',
                        marginBottom:'-2px',transition:'all var(--transition-fast)'
                    }}>
                        <tab.icon size={16}/>{tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'projects' && <ProjectsTab clientId={client._id}/>}
            {activeTab === 'notes'    && <NotesTab    clientId={client._id}/>}

            <EditClientModal isOpen={showEdit} onClose={()=>setShowEdit(false)} client={client} onSave={handleSave}/>
        </div>
    );
}