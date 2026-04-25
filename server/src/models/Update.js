import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    name:       { type: String, required: true },
    url:        { type: String, required: true },
    publicId:   { type: String, required: true },
    size:       { type: Number, default: 0 },
    type:       { type: String, default: 'file' },
    uploadedAt: { type: Date,   default: Date.now }
}, { _id: false });

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
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
        index: true
    },
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
    authorName:         { type: String, default: '' },
    files:              [fileSchema],
    requiresApproval:   { type: Boolean, default: false },
    approvalStatus: {
        type: String,
        enum: ['none', 'pending', 'approved', 'changes-requested'],
        default: 'none'
    },
    approvedBy:         { type: String, default: null },
    approvedAt:         { type: Date,   default: null },
    changeRequestNote:  { type: String, default: null },
    changeRequestedAt:  { type: Date,   default: null }
}, { timestamps: true });

const Update = mongoose.model('Update', updateSchema);
export default Update;