import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    size: { type: String, default: '' },
    sizeBytes: { type: Number, default: 0 },
    type: { type: String, default: 'file' },
    publicId: { type: String, default: '' }, // Cloudinary public ID
    uploadedAt: { type: Date, default: Date.now }
}, { _id: false });

const updateSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Update title is required'],
        trim: true,
        maxlength: 300
    },
    content: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['progress', 'milestone', 'delivery'],
        default: 'progress'
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    author: {
        type: String,
        default: ''
    },
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
    changeRequestedBy: {
        type: String,
        default: null
    },
    changeRequestedAt: {
        type: Date,
        default: null
    },
    changeRequestNote: {
        type: String,
        default: ''
    },
    files: [fileSchema]
}, {
    timestamps: true
});

const Update = mongoose.model('Update', updateSchema);
export default Update;
