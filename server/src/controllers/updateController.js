import Update from '../models/Update.js';
import Project from '../models/Project.js';
import Client from '../models/Client.js';
import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { sendUpdatePostedEmail, sendApprovalEmail } from '../utils/emailService.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ── AGENCY ────────────────────────────────────────────────────────

export const getUpdatesByProject = async (req, res, next) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, agencyId: req.user._id });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        const updates = await Update.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
        res.json({ success: true, updates });
    } catch (err) { next(err); }
};

export const createUpdate = async (req, res, next) => {
    try {
        const { projectId, title, content, type = 'progress', requiresApproval = false } = req.body;

        if (!projectId || !title || !content)
            return res.status(400).json({ success: false, message: 'Project ID, title and content are required.' });

        const project = await Project.findOne({ _id: projectId, agencyId: req.user._id });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

        const client = await Client.findById(project.clientId);

        // Handle file uploads
        let files = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploaded = await uploadToCloudinary(file.buffer, `clientloop/updates`, file.originalname);
                files.push(uploaded);
            }
        }

        const update = await Update.create({
            title, content, type, projectId,
            clientId: project.clientId,
            agencyId: req.user._id,
            authorName: req.user.name,
            files,
            requiresApproval,
            approvalStatus: requiresApproval ? 'pending' : 'none'
        });

        // In-app notification
        if (client?.userId) {
            await Notification.create({
                userId: client.userId, type: 'update_posted',
                title: 'New project update',
                message: `${req.user.name} posted: ${title}`,
                link: `/client`,
                meta: { clientId: project.clientId, projectId, updateId: update._id }
            });
        }

        // Email to client
        if (client?.email) {
            sendUpdatePostedEmail({
                to: client.email,
                clientName: client.contactName || client.name,
                agencyName: req.user.company || req.user.name,
                projectName: project.name,
                updateTitle: title,
                loginUrl: `${CLIENT_URL}/client-login`
            });
        }

        res.status(201).json({ success: true, update });
    } catch (err) { next(err); }
};

export const editUpdate = async (req, res, next) => {
    try {
        const { title, content, type, requiresApproval } = req.body;
        const update = await Update.findOne({ _id: req.params.id, agencyId: req.user._id });
        if (!update) return res.status(404).json({ success: false, message: 'Update not found.' });
        if (update.approvalStatus === 'approved')
            return res.status(400).json({ success: false, message: 'Cannot edit an approved update.' });

        if (title)   update.title   = title;
        if (content) update.content = content;
        if (type)    update.type    = type;
        if (requiresApproval !== undefined) {
            update.requiresApproval = requiresApproval;
            update.approvalStatus   = requiresApproval ? 'pending' : 'none';
        }
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploaded = await uploadToCloudinary(file.buffer, `clientloop/updates`, file.originalname);
                update.files.push(uploaded);
            }
        }

        await update.save();
        res.json({ success: true, update });
    } catch (err) { next(err); }
};

export const deleteUpdate = async (req, res, next) => {
    try {
        const update = await Update.findOne({ _id: req.params.id, agencyId: req.user._id });
        if (!update) return res.status(404).json({ success: false, message: 'Update not found.' });

        for (const file of update.files) await deleteFromCloudinary(file.publicId);
        await Comment.deleteMany({ updateId: update._id });
        await Update.findByIdAndDelete(update._id);

        res.json({ success: true, message: 'Update deleted.' });
    } catch (err) { next(err); }
};

export const removeFile = async (req, res, next) => {
    try {
        const update = await Update.findOne({ _id: req.params.id, agencyId: req.user._id });
        if (!update) return res.status(404).json({ success: false, message: 'Update not found.' });

        const file = update.files.find(f => f.publicId === req.params.publicId);
        if (!file) return res.status(404).json({ success: false, message: 'File not found.' });

        await deleteFromCloudinary(file.publicId);
        update.files = update.files.filter(f => f.publicId !== req.params.publicId);
        await update.save();

        res.json({ success: true, update });
    } catch (err) { next(err); }
};

// ── CLIENT ────────────────────────────────────────────────────────

export const getMyUpdates = async (req, res, next) => {
    try {
        const updates = await Update.find({ clientId: req.user.clientId }).sort({ createdAt: -1 });
        res.json({ success: true, updates });
    } catch (err) { next(err); }
};

export const getUpdatesByProjectForClient = async (req, res, next) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, clientId: req.user.clientId });
        if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
        const updates = await Update.find({ projectId: req.params.projectId }).sort({ createdAt: -1 });
        res.json({ success: true, updates });
    } catch (err) { next(err); }
};

export const approveUpdate = async (req, res, next) => {
    try {
        const update = await Update.findOne({ _id: req.params.id, clientId: req.user.clientId });
        if (!update) return res.status(404).json({ success: false, message: 'Update not found.' });

        update.approvalStatus = 'approved';
        update.approvedBy     = req.user.name;
        update.approvedAt     = new Date();
        await update.save();

        const project = await Project.findById(update.projectId);
        const agency  = await User.findById(update.agencyId);

        await Notification.create({
            userId: update.agencyId, type: 'approved',
            title: 'Update approved',
            message: `${req.user.name} approved: ${update.title}`,
            link: `/clients/${update.clientId}`,
            meta: { projectId: update.projectId, updateId: update._id }
        });

        if (agency?.email) {
            sendApprovalEmail({
                to: agency.email, agencyName: agency.name,
                clientName: req.user.name, projectName: project?.name || '',
                updateTitle: update.title, status: 'approved',
                loginUrl: `${CLIENT_URL}/dashboard`
            });
        }

        res.json({ success: true, update });
    } catch (err) { next(err); }
};

export const requestChanges = async (req, res, next) => {
    try {
        const { note } = req.body;
        const update = await Update.findOne({ _id: req.params.id, clientId: req.user.clientId });
        if (!update) return res.status(404).json({ success: false, message: 'Update not found.' });

        update.approvalStatus    = 'changes-requested';
        update.changeRequestNote = note || '';
        update.changeRequestedAt = new Date();
        await update.save();

        const project = await Project.findById(update.projectId);
        const agency  = await User.findById(update.agencyId);

        await Notification.create({
            userId: update.agencyId, type: 'changes_requested',
            title: 'Changes requested',
            message: `${req.user.name} requested changes on: ${update.title}`,
            link: `/clients/${update.clientId}`,
            meta: { projectId: update.projectId, updateId: update._id }
        });

        if (agency?.email) {
            sendApprovalEmail({
                to: agency.email, agencyName: agency.name,
                clientName: req.user.name, projectName: project?.name || '',
                updateTitle: update.title, status: 'changes-requested',
                note, loginUrl: `${CLIENT_URL}/dashboard`
            });
        }

        res.json({ success: true, update });
    } catch (err) { next(err); }
};