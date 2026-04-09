import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
        trim: true,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['not-started', 'in-progress', 'waiting-approval', 'completed'],
        default: 'not-started'
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
    clientName: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
