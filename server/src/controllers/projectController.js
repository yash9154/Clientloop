import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Update from '../models/Update.js';
import Comment from '../models/Comment.js';

/**
 * Agency — get all projects for a specific client
 */
export const getProjectsByClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({
            _id: req.params.clientId,
            agencyId: req.user._id
        });
        if (!client) return res.status(404).json({ success: false, message: 'Client not found.' });

        const projects = await Project.find({
            clientId: req.params.clientId,
            agencyId: req.user._id
        }).sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (err) { next(err); }
};

/**
 * Client portal — get projects assigned to this client
 * req.user.clientId is the Client._id stored on their User record
 */
export const getProjectsByClientForClient = async (req, res, next) => {
    try {
        if (!req.user.clientId) {
            return res.status(400).json({ success: false, message: 'No client ID on this account.' });
        }

        const projects = await Project.find({ clientId: req.user.clientId })
            .sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (err) { next(err); }
};

/**
 * Agency — get single project
 */
export const getProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            agencyId: req.user._id
        });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        res.json({ success: true, project });
    } catch (err) { next(err); }
};

/**
 * Agency — create project for a client
 */
export const createProject = async (req, res, next) => {
    try {
        const { clientId, name, description } = req.body;
        if (!clientId || !name)
            return res.status(400).json({ success: false, message: 'Client ID and project name are required.' });

        const client = await Client.findOne({ _id: clientId, agencyId: req.user._id });
        if (!client) return res.status(404).json({ success: false, message: 'Client not found.' });

        const project = await Project.create({
            name,
            description: description || '',
            clientId,
            agencyId: req.user._id,
            clientName: client.name
        });

        res.status(201).json({ success: true, project });
    } catch (err) { next(err); }
};

/**
 * Agency — update project details or status
 */
export const updateProject = async (req, res, next) => {
    try {
        const { name, description, status } = req.body;
        const updates = {};
        if (name)                    updates.name        = name;
        if (description !== undefined) updates.description = description;
        if (status)                  updates.status      = status;

        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user._id },
            updates,
            { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        res.json({ success: true, project });
    } catch (err) { next(err); }
};

/**
 * Agency — delete project and all its updates + comments
 */
export const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            agencyId: req.user._id
        });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

        const updates   = await Update.find({ projectId: project._id });
        const updateIds = updates.map(u => u._id);
        await Comment.deleteMany({ updateId: { $in: updateIds } });
        await Update.deleteMany({ projectId: project._id });
        await Project.findByIdAndDelete(project._id);

        res.json({ success: true, message: 'Project deleted.' });
    } catch (err) { next(err); }
};