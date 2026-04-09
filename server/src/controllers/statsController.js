import Client from '../models/Client.js';
import Project from '../models/Project.js';
import Update from '../models/Update.js';

/**
 * @desc    Get dashboard stats for the agency
 * @route   GET /api/stats/dashboard
 */
export const getDashboardStats = async (req, res, next) => {
    try {
        const agencyId = req.user._id;

        // Parallel queries for speed
        const [
            totalClients,
            activeClients,
            totalProjects,
            projectsByStatus,
            recentUpdates,
            pendingApprovals
        ] = await Promise.all([
            Client.countDocuments({ agencyId }),
            Client.countDocuments({ agencyId, status: 'active' }),
            Project.countDocuments({ agencyId }),
            Project.aggregate([
                { $match: { agencyId } },
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Update.find({ agencyId })
                .sort({ createdAt: -1 })
                .limit(10)
                .populate('projectId', 'name clientName'),
            Update.countDocuments({ agencyId, approvalStatus: 'pending' })
        ]);

        // Format project status counts
        const statusCounts = {};
        projectsByStatus.forEach(s => {
            statusCounts[s._id] = s.count;
        });

        res.json({
            success: true,
            stats: {
                totalClients,
                activeClients,
                totalProjects,
                activeProjects: statusCounts['in-progress'] || 0,
                completedProjects: statusCounts['completed'] || 0,
                waitingApproval: statusCounts['waiting-approval'] || 0,
                pendingApprovals,
                recentUpdates: recentUpdates.map(u => ({
                    id: u._id,
                    title: u.title,
                    type: u.type,
                    approvalStatus: u.approvalStatus,
                    projectName: u.projectId?.name || '',
                    clientName: u.projectId?.clientName || '',
                    createdAt: u.createdAt
                }))
            }
        });
    } catch (error) {
        next(error);
    }
};
