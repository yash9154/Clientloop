import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        minlength: 6,
        select: false // Don't include password in queries by default
    },
    role: {
        type: String,
        enum: ['agency', 'client'],
        default: 'agency'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        default: null
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    plan: {
        type: String,
        enum: ['free', 'starter', 'agency'],
        default: 'free'
    },
    avatar: {
        type: String,
        default: null
    },
    googleId: {
        type: String,
        default: null
    },
    subscription: {
        plan: { type: String, default: 'free' },
        status: { type: String, default: 'active' },
        clientLimit: { type: Number, default: 1 },
        projectLimit: { type: Number, default: 3 },
        storageLimit: { type: Number, default: 50 * 1024 * 1024 }, // 50MB
        stripeCustomerId: { type: String, default: null },
        stripeSubscriptionId: { type: String, default: null }
    },
    // Password reset token fields
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    },
    // Email verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    import('crypto').then(({ randomBytes }) => {
        const resetToken = randomBytes(32).toString('hex');
        this.passwordResetToken = resetToken;
        this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // expires in 1 hour
    });
};

// Verify password reset token
userSchema.methods.verifyPasswordResetToken = function (token) {
    return (
        this.passwordResetToken === token &&
        this.passwordResetExpires > new Date()
    );
};

// Clear password reset token
userSchema.methods.clearPasswordResetToken = function () {
    this.passwordResetToken = null;
    this.passwordResetExpires = null;
};

// Add indexes for frequently queried fields
userSchema.index({ email: 1 }); // Email lookups
userSchema.index({ googleId: 1 }); // Google OAuth lookups
userSchema.index({ role: 1 }); // Filter by role
userSchema.index({ createdAt: -1 }); // Sort by creation date
userSchema.index({ passwordResetToken: 1 }); // Fast token lookups

const User = mongoose.model('User', userSchema);
export default User;
