import mongoose from 'mongoose';

const updateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: 300
    },
    content: {
        type: String,
        required: [true, 'Content is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['progress', 'milestone', 'delivery'],
        default: 'progress'
    },
    // Linked directly to client — no projects layer
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Author display name
    authorName: {
        type: String,
        default: ''
    },
    // Approval workflow
    requiresApproval: {
        type: Boolean,
        default: false
    },
    approvalStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'changes-requested'],
        default: 'none'
    },
    approvedBy: {
        type: String,
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    changeRequestNote: {
        type: String,
        default: null
    },
    changeRequestedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

const Update = mongoose.model('Update', updateSchema);
export default Update;