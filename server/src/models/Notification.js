import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['update_posted', 'approved', 'changes_requested', 'comment_added', 'client_created'],
        required: true
    },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    read:    { type: Boolean, default: false },
    // Deep link — frontend uses this to navigate on click
    link:    { type: String, default: null },
    // Optional metadata
    meta: {
        clientId:  { type: mongoose.Schema.Types.ObjectId, default: null },
        projectId: { type: mongoose.Schema.Types.ObjectId, default: null },
        updateId:  { type: mongoose.Schema.Types.ObjectId, default: null }
    }
}, { timestamps: true });

notificationSchema.index({ userId: 1, read: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;