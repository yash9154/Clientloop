import Project from '../models/Project.js';
import Update from '../models/Update.js';
import Comment from '../models/Comment.js';
import Client from '../models/Client.js';

/**
 * @desc    Get all projects for the agency
 * @route   GET /api/projects
 */
export const getProjects = async (req, res, next) => {
    try {
        let query = {};

        if (req.user.role === 'agency') {
            query.agencyId = req.user._id;
        } else {
            // Client user - find their client records and get projects
            const clientRecords = await Client.find({ email: req.user.email });
            const clientIds = clientRecords.map(c => c._id);
            query.clientId = { $in: clientIds };
        }

        const projects = await Project.find(query)
            .populate('clientId', 'name email company')
            .sort({ updatedAt: -1 });

        res.json({ success: true, projects });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get projects by client ID
 * @route   GET /api/projects/client/:clientId
 */
export const getProjectsByClient = async (req, res, next) => {
    try {
        const projects = await Project.find({
            clientId: req.params.clientId,
            agencyId: req.user._id
        }).sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 */
export const getProject = async (req, res, next) => {
    try {
        let query = { _id: req.params.id };

        if (req.user.role === 'agency') {
            query.agencyId = req.user._id;
        } else {
            // Client: verify they have access
            const clientRecords = await Client.find({ email: req.user.email });
            const clientIds = clientRecords.map(c => c._id);
            query.clientId = { $in: clientIds };
        }

        const project = await Project.findOne(query)
            .populate('clientId', 'name email company');

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        res.json({ success: true, project });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 */
export const createProject = async (req, res, next) => {
    try {
        const { name, description, clientId, status = 'not-started' } = req.body;

        // Get client name
        const client = await Client.findOne({
            _id: clientId,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        const project = await Project.create({
            name,
            description,
            status,
            clientId,
            agencyId: req.user._id,
            clientName: client.name
        });

        res.status(201).json({ success: true, project });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a project
 * @route   PUT /api/projects/:id
 */
export const updateProject = async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        res.json({ success: true, project });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a project and all related data
 * @route   DELETE /api/projects/:id
 */
export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            agencyId: req.user._id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found.'
            });
        }

        // Delete related data
        const updates = await Update.find({ projectId: project._id });
        const updateIds = updates.map(u => u._id);

        await Comment.deleteMany({ updateId: { $in: updateIds } });
        await Update.deleteMany({ projectId: project._id });
        await Project.findByIdAndDelete(project._id);

        res.json({
            success: true,
            message: 'Project and all related data deleted.'
        });
    } catch (error) {
        next(error);
    }
};
