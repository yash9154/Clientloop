import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import {
    FolderOpen,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

function StatusBadge({ status }) {
    const config = {
        'not-started': { label: 'Not Started', class: 'badge-not-started' },
        'in-progress': { label: 'In Progress', class: 'badge-in-progress' },
        'waiting-approval': { label: 'Needs Your Approval', class: 'badge-waiting' },
        'completed': { label: 'Completed', class: 'badge-completed' }
    };

    const { label, class: className } = config[status] || config['not-started'];

    return <span className={`badge ${className}`}>{label}</span>;
}

function ProjectCard({ project, pendingApprovals }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const hasPending = pendingApprovals > 0;

    return (
        <Link
            to={`/client/project/${project._id || project.id}`}
            className="card card-hover animate-fade-in-up"
            style={{
                display: 'block',
                border: hasPending ? '2px solid var(--color-warning-400)' : undefined
            }}
        >
            <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                    <h3 style={{
                        fontSize: 'var(--font-size-lg)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--text-primary)'
                    }}>
                        {project.name}
                    </h3>
                    <StatusBadge status={project.status} />
                </div>

                <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--text-tertiary)',
                    marginBottom: 'var(--space-4)',
                    lineHeight: 'var(--line-height-relaxed)'
                }}>
                    {project.description}
                </p>

                {hasPending && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        padding: 'var(--space-3)',
                        background: 'var(--color-warning-50)',
                        borderRadius: 'var(--radius-lg)',
                        marginBottom: 'var(--space-4)'
                    }}>
                        <AlertCircle size={18} style={{ color: 'var(--color-warning-600)' }} />
                        <span style={{
                            fontSize: 'var(--font-size-sm)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-warning-700)'
                        }}>
                            {pendingApprovals} item{pendingApprovals > 1 ? 's' : ''} waiting for your approval
                        </span>
                    </div>
                )}

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span style={{
                        fontSize: 'var(--font-size-xs)',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)'
                    }}>
                        <Clock size={12} />
                        Updated {formatDate(project.updatedAt)}
                    </span>
                    <span style={{
                        color: 'var(--color-primary-600)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-medium)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)'
                    }}>
                        View Updates
                        <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default function ClientDashboard() {
    const { projects, getUpdatesByProject } = useData();
    const { user } = useAuth();
    const [projectUpdates, setProjectUpdates] = useState({});

    // Projects are already filtered server-side by client email
    const clientProjects = projects;

    // Fetch updates for all projects to calculate pending approvals
    useEffect(() => {
        if (!clientProjects.length) return;

        let cancelled = false;
        const fetchAllUpdates = async () => {
            const updatesMap = {};
            for (const project of clientProjects) {
                const pid = project._id || project.id;
                try {
                    const data = await getUpdatesByProject(pid);
                    updatesMap[pid] = data || [];
                } catch {
                    updatesMap[pid] = [];
                }
            }
            if (!cancelled) setProjectUpdates(updatesMap);
        };

        fetchAllUpdates();
        return () => { cancelled = true; };
    }, [clientProjects, getUpdatesByProject]);

    const getPendingApprovals = (projectId) => {
        const updates = projectUpdates[projectId] || [];
        return updates.filter(u => u.approvalStatus === 'pending').length;
    };

    const totalPending = Object.values(projectUpdates).flat().filter(u => u.approvalStatus === 'pending').length;

    return (
        <div>
            {/* Welcome Section */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
                <h1 style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    marginBottom: 'var(--space-2)'
                }}>
                    Welcome to Your Project Portal 👋
                </h1>
                <p style={{ color: 'var(--text-tertiary)' }}>
                    View project updates, download files, and approve deliverables.
                </p>
            </div>

            {/* Alert for pending approvals */}
            {totalPending > 0 && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--space-4) var(--space-5)',
                    background: 'linear-gradient(135deg, var(--color-warning-50) 0%, #fff7ed 100%)',
                    border: '1px solid var(--color-warning-200)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--space-6)',
                    flexWrap: 'wrap',
                    gap: 'var(--space-3)'
                }} className="animate-fade-in-up">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'var(--color-warning-100)',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-warning-600)'
                        }}>
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-warning-800)' }}>
                                Action Required
                            </div>
                            <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-warning-700)' }}>
                                You have {totalPending} item{totalPending > 1 ? 's' : ''} waiting for your approval.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Projects Section */}
            <h2 style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: 'var(--space-4)'
            }}>
                Your Projects
            </h2>

            {clientProjects.length === 0 ? (
                <div className="card">
                    <div className="empty-state" style={{ padding: 'var(--space-12)' }}>
                        <FolderOpen className="empty-state-icon" />
                        <h3 className="empty-state-title">No projects yet</h3>
                        <p className="empty-state-description">
                            Your projects will appear here once they are created.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                    {clientProjects.map((project, index) => (
                        <div key={project._id || project.id} style={{ animationDelay: `${index * 0.05}s` }}>
                            <ProjectCard
                                project={project}
                                pendingApprovals={getPendingApprovals(project._id || project.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
