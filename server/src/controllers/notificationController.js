import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 }).limit(50);
        const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
        res.json({ success: true, notifications, unreadCount });
    } catch (err) { next(err); }
};

export const markAsRead = async (req, res, next) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) { next(err); }
};

export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
        res.json({ success: true });
    } catch (err) { next(err); }
};

export const deleteNotification = async (req, res, next) => {
    try {
        await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ success: true });
    } catch (err) { next(err); }
};