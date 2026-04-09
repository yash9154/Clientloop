import Comment from '../models/Comment.js';
import Notification from '../models/Notification.js';
import Update from '../models/Update.js';

/**
 * @desc    Get comments for an update
 * @route   GET /api/comments/update/:updateId
 */
export const getCommentsByUpdate = async (req, res, next) => {
    try {
        const comments = await Comment.find({ updateId: req.params.updateId })
            .sort({ createdAt: 1 });

        res.json({ success: true, comments });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a comment
 * @route   POST /api/comments
 */
export const createComment = async (req, res, next) => {
    try {
        const { content, updateId } = req.body;

        const comment = await Comment.create({
            content,
            updateId,
            authorId: req.user._id,
            authorName: req.user.name,
            authorRole: req.user.role
        });

        // Create notification
        const update = await Update.findById(updateId);
        if (update) {
            // Notify the other party
            const notifyUserId = req.user.role === 'agency'
                ? null // Will be handled separately
                : update.agencyId;

            if (notifyUserId) {
                await Notification.create({
                    userId: notifyUserId,
                    type: 'comment',
                    title: 'New Comment',
                    message: `${req.user.name} commented on "${update.title}"`,
                    link: req.user.role === 'client'
                        ? `/projects/${update.projectId}`
                        : `/client/project/${update.projectId}`,
                    metadata: { projectId: update.projectId, updateId }
                });
            }
        }

        res.status(201).json({ success: true, comment });
    } catch (error) {
        next(error);
    }
};
