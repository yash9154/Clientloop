import Comment from '../models/Comment.js';
import Update from '../models/Update.js';
import Client from '../models/Client.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { sendCommentEmail } from '../utils/emailService.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const getCommentsByUpdate = async (req, res, next) => {
    try {
        const comments = await Comment.find({ updateId: req.params.updateId }).sort({ createdAt: 1 });
        res.json({ success: true, comments });
    } catch (err) { next(err); }
};

export const createComment = async (req, res, next) => {
    try {
        const { updateId, content } = req.body;
        if (!updateId || !content)
            return res.status(400).json({ success: false, message: 'Update ID and content are required.' });

        const update = await Update.findById(updateId);
        if (!update) return res.status(404).json({ success: false, message: 'Update not found.' });

        const comment = await Comment.create({
            content, updateId,
            authorId:   req.user._id,
            authorName: req.user.name,
            authorRole: req.user.role
        });

        // Notify the OTHER party
        const isAgency = req.user.role === 'agency';

        if (isAgency) {
            // Agency commented → notify client
            const client = await Client.findById(update.clientId);
            if (client?.userId) {
                await Notification.create({
                    userId: client.userId, type: 'comment_added',
                    title: 'New comment',
                    message: `${req.user.name} commented on: ${update.title}`,
                    link: `/client`,
                    meta: { updateId }
                });
            }
            if (client?.email) {
                sendCommentEmail({
                    to: client.email,
                    recipientName:  client.contactName || client.name,
                    commenterName:  req.user.name,
                    commenterRole:  'Agency',
                    updateTitle:    update.title,
                    commentContent: content,
                    loginUrl:       `${CLIENT_URL}/client-login`
                });
            }
        } else {
            // Client commented → notify agency
            const agency = await User.findById(update.agencyId);
            await Notification.create({
                userId: update.agencyId, type: 'comment_added',
                title: 'New comment from client',
                message: `${req.user.name} commented on: ${update.title}`,
                link: `/clients/${update.clientId}`,
                meta: { updateId }
            });
            if (agency?.email) {
                sendCommentEmail({
                    to: agency.email,
                    recipientName:  agency.name,
                    commenterName:  req.user.name,
                    commenterRole:  'Client',
                    updateTitle:    update.title,
                    commentContent: content,
                    loginUrl:       `${CLIENT_URL}/dashboard`
                });
            }
        }

        res.status(201).json({ success: true, comment });
    } catch (err) { next(err); }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findOneAndDelete({
            _id: req.params.id,
            authorId: req.user._id
        });
        if (!comment) return res.status(404).json({ success: false, message: 'Comment not found.' });
        res.json({ success: true, message: 'Comment deleted.' });
    } catch (err) { next(err); }
};