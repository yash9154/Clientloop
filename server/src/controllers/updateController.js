import Update from '../models/Update.js';
import Client from '../models/Client.js';

/**
 * @desc    Get all updates for a client
 * @route   GET /api/updates/client/:clientId
 */
export const getUpdatesByClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({
            _id: req.params.clientId,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }

        const updates = await Update.find({ clientId: req.params.clientId })
            .sort({ createdAt: -1 });

        res.json({ success: true, updates });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get updates for client portal (client viewing their own updates)
 * @route   GET /api/updates/my-updates
 */
export const getMyUpdates = async (req, res, next) => {
    try {
        // req.user.clientId is set for client role users
        const updates = await Update.find({ clientId: req.user.clientId })
            .sort({ createdAt: -1 });

        res.json({ success: true, updates });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create an update for a client
 * @route   POST /api/updates
 */
export const createUpdate = async (req, res, next) => {
    try {
        const { clientId, title, content, type = 'progress', requiresApproval = false } = req.body;

        if (!clientId || !title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Client ID, title and content are required.'
            });
        }

        // Verify client belongs to this agency
        const client = await Client.findOne({
            _id: clientId,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }

        const update = await Update.create({
            title,
            content,
            type,
            clientId,
            agencyId: req.user._id,
            authorName: req.user.name,
            requiresApproval,
            approvalStatus: requiresApproval ? 'pending' : 'none'
        });

        res.status(201).json({ success: true, update });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Edit an update (agency only, before approval)
 * @route   PUT /api/updates/:id
 */
export const editUpdate = async (req, res, next) => {
    try {
        const { title, content, type, requiresApproval } = req.body;

        const update = await Update.findOne({
            _id: req.params.id,
            agencyId: req.user._id
        });

        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found.' });
        }

        if (update.approvalStatus === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Cannot edit an already approved update.'
            });
        }

        if (title) update.title = title;
        if (content) update.content = content;
        if (type) update.type = type;
        if (requiresApproval !== undefined) {
            update.requiresApproval = requiresApproval;
            update.approvalStatus = requiresApproval ? 'pending' : 'none';
        }

        await update.save();
        res.json({ success: true, update });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete an update
 * @route   DELETE /api/updates/:id
 */
export const deleteUpdate = async (req, res, next) => {
    try {
        const update = await Update.findOneAndDelete({
            _id: req.params.id,
            agencyId: req.user._id
        });

        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found.' });
        }

        res.json({ success: true, message: 'Update deleted.' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve an update (client only)
 * @route   PUT /api/updates/:id/approve
 */
export const approveUpdate = async (req, res, next) => {
    try {
        const update = await Update.findOne({
            _id: req.params.id,
            clientId: req.user.clientId
        });

        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found.' });
        }

        update.approvalStatus = 'approved';
        update.approvedBy = req.user.name;
        update.approvedAt = new Date();
        await update.save();

        res.json({ success: true, update });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Request changes on an update (client only)
 * @route   PUT /api/updates/:id/request-changes
 */
export const requestChanges = async (req, res, next) => {
    try {
        const { note } = req.body;

        const update = await Update.findOne({
            _id: req.params.id,
            clientId: req.user.clientId
        });

        if (!update) {
            return res.status(404).json({ success: false, message: 'Update not found.' });
        }

        update.approvalStatus = 'changes-requested';
        update.changeRequestNote = note || '';
        update.changeRequestedAt = new Date();
        await update.save();

        res.json({ success: true, update });
    } catch (error) {
        next(error);
    }
};