import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Client name is required'],
        trim: true,
        maxlength: 200
    },
    email: {
        type: String,
        required: [true, 'Client email is required'],
        lowercase: true,
        trim: true
    },
    contactName: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    industry: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'lead'],
        default: 'active'
    },
    // Follow-up date set by agency
    followUpDate: {
        type: Date,
        default: null
    },
    // The agency user who owns this client
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // The auto-created User account for client portal login
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// One email per agency (same client email can exist under different agencies)
clientSchema.index({ email: 1, agencyId: 1 }, { unique: true });

const Client = mongoose.model('Client', clientSchema);
export default Client;