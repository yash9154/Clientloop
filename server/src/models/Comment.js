import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Comment content is required'],
        trim: true,
        maxlength: 5000
    },
    updateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Update',
        required: true,
        index: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    authorRole: {
        type: String,
        enum: ['agency', 'client'],
        required: true
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
