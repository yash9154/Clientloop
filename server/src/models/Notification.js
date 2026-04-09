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
        enum: ['approval', 'changes-requested', 'comment', 'update', 'general'],
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        default: ''
    },
    read: {
        type: Boolean,
        default: false
    },
    link: {
        type: String,
        default: ''
    },
    metadata: {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
        updateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Update' },
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }
    }
}, {
    timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
