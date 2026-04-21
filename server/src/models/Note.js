import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    // The note content
    content: {
        type: String,
        required: [true, 'Note content is required'],
        trim: true,
        maxlength: 2000
    },
    // Type of note — shows as a tag in the timeline
    type: {
        type: String,
        enum: ['note', 'call', 'email', 'meeting', 'proposal', 'follow-up'],
        default: 'note'
    },
    // Which client this note belongs to
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        index: true
    },
    // The agency user who wrote it
    agencyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    // Author display name (denormalized for speed)
    authorName: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Note = mongoose.model('Note', noteSchema);
export default Note;