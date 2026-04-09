import Update from '../models/Update.js';
import Project from '../models/Project.js';
import Notification from '../models/Notification.js';
import Client from '../models/Client.js';

/**
 * @desc    Get all updates for the agency or client
 * @route   GET /api/updates
 */
export const getUpdates = async (req, res, next) => {
    try {
        let query = {};

        if (req.user.role === 'agency') {
            query.agencyId = req.user._id;
        } else {
            // Client user - find their client records and get projects
            const clientRecords = await Client.find({ email: req.user.email });
            const clientIds = clientRecords.map(c => c._id);
            const projects = await Project.find({ clientId: { $in: clientIds } });
            const projectIds = projects.map(p => p._id);
            query.projectId = { $in: projectIds };
        }

        const updates = await Update.find(query)
            .sort({ createdAt: -1 });

        res.json({ success: true, updates });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get updates for a project
 * @route   GET /api/updates/project/:projectId
 */
export const getUpdatesByProject = async (req, res, next) => {
    try {
        const updates = await Update.find({ projectId: req.params.projectId })
            .sort({ createdAt: -1 });

        res.json({ success: true, updates });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new update
 * @route   POST /api/updates
 */
export const createUpdate = async (req, res, next) => {
    try {
        const {
            title, content, type = 'progress',
            projectId, requiresApproval = false, files = []
        } = req.body;

        // Verify project belongs to agency
        const project = await Project.findOne({
            _id: projectId,
            agencyId: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        const update = await Update.create({
            title,
            content,
            type,
            projectId,
            agencyId: req.user._id,
            author: req.user.name,
            requiresApproval,
            approvalStatus: requiresApproval ? 'pending' : 'none',
            files
        });

        // Update project status
        if (requiresApproval) {
            await Project.findByIdAndUpdate(projectId, { status: 'waiting-approval' });
        } else {
            await Project.findByIdAndUpdate(projectId, { status: 'in-progress' });
        }

        // Create notification for the client
        const client = await Client.findById(project.clientId);
        if (client) {
            // Find client user account by email
            const User = (await import('../models/User.js')).default;
            const clientUser = await User.findOne({ email: client.email, role: 'client' });
            if (clientUser) {
                await Notification.create({
                    userId: clientUser._id,
                    type: requiresApproval ? 'approval' : 'update',
                    title: requiresApproval ? 'Approval Requested' : 'New Update',
                    message: `${req.user.name} posted "${title}" on ${project.name}`,
                    link: `/client/project/${projectId}`,
                    metadata: { projectId, updateId: update._id, clientId: client._id }
                });
            }
        }

        res.status(201).json({ success: true, update });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve an update
 * @route   POST /api/updates/:id/approve
 */
export const approveUpdate = async (req, res, next) => {
    try {
        const update = await Update.findByIdAndUpdate(
            req.params.id,
            {
                approvalStatus: 'approved',
                approvedBy: req.user.name,
                approvedAt: new Date()
            },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Update not found.'
            });
        }

        // Notify agency
        await Notification.create({
            userId: update.agencyId,
            type: 'approval',
            title: 'Update Approved',
            message: `${req.user.name} approved "${update.title}"`,
            link: `/projects/${update.projectId}`,
            metadata: { projectId: update.projectId, updateId: update._id }
        });

        res.json({ success: true, update });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Request changes on an update
 * @route   POST /api/updates/:id/request-changes
 */
export const requestChanges = async (req, res, next) => {
    try {
        const { note = '' } = req.body;

        const update = await Update.findByIdAndUpdate(
            req.params.id,
            {
                approvalStatus: 'changes-requested',
                changeRequestedBy: req.user.name,
                changeRequestedAt: new Date(),
                changeRequestNote: note
            },
            { new: true }
        );

        if (!update) {
            return res.status(404).json({
                success: false,
                message: 'Update not found.'
            });
        }

        // Notify agency
        await Notification.create({
            userId: update.agencyId,
            type: 'changes-requested',
            title: 'Changes Requested',
            message: `${req.user.name} requested changes on "${update.title}"${note ? `: ${note}` : ''}`,
            link: `/projects/${update.projectId}`,
            metadata: { projectId: update.projectId, updateId: update._id }
        });

        res.json({ success: true, update });
    } catch (error) {
        next(error);
    }
};
