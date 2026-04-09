import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import { validatePasswordStrength, generateSecurePassword } from '../utils/passwordValidator.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';
import { randomBytes } from 'crypto';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
    try {
        const { name, email, password, role = 'agency', company = '' } = req.body;

        // Validate password strength
        const passwordCheck = validatePasswordStrength(password);
        if (!passwordCheck.isStrong) {
            return res.status(400).json({
                success: false,
                message: 'Password does not meet strength requirements',
                errors: passwordCheck.errors
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered. Please sign in instead.'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role,
            company,
            subscription: {
                plan: 'free',
                status: 'active',
                clientLimit: 1,
                projectLimit: 3,
                storageLimit: 50 * 1024 * 1024
            }
        });

        // Generate JWT
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                plan: user.plan,
                avatar: user.avatar,
                clientId: user.clientId || null,
                subscription: user.subscription,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password, isClientLogin = false } = req.body;

        // Find user with password field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Verify role matches login type
        if (isClientLogin && user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: 'Please use the agency login for agency accounts.'
            });
        }
        if (!isClientLogin && user.role === 'client') {
            return res.status(403).json({
                success: false,
                message: 'Please use the client portal for client accounts.'
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                plan: user.plan,
                avatar: user.avatar,
                clientId: user.clientId || null,
                subscription: user.subscription,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Google OAuth login/signup
 * @route   POST /api/auth/google
 */
export const googleAuth = async (req, res, next) => {
    try {
        const { googleId, email, name, avatar } = req.body;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });
        let isNewUser = false;

        if (!user) {
            // Create new user from Google data
            user = await User.create({
                name,
                email,
                googleId,
                avatar,
                role: 'agency',
                company: '',
                subscription: {
                    plan: 'free',
                    status: 'active',
                    clientLimit: 1,
                    projectLimit: 3,
                    storageLimit: 50 * 1024 * 1024
                }
            });
            isNewUser = true;
        } else if (!user.googleId) {
            // Link Google account to existing user
            user.googleId = googleId;
            if (!user.avatar && avatar) user.avatar = avatar;
            await user.save();
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            isNewUser,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                plan: user.plan,
                avatar: user.avatar,
                clientId: user.clientId || null,
                subscription: user.subscription,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res, next) => {
    try {
        res.json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                company: req.user.company,
                plan: req.user.plan,
                avatar: req.user.avatar,
                clientId: req.user.clientId || null,
                subscription: req.user.subscription,
                createdAt: req.user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 */
export const updateProfile = async (req, res, next) => {
    try {
        const { name, company, avatar } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (company !== undefined) updates.company = company;
        if (avatar !== undefined) updates.avatar = avatar;

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true
        });

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                company: user.company,
                plan: user.plan,
                avatar: user.avatar,
                clientId: user.clientId || null,
                subscription: user.subscription,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 */
export const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate new password strength
        const passwordCheck = validatePasswordStrength(newPassword);
        if (!passwordCheck.isStrong) {
            return res.status(400).json({
                success: false,
                message: 'New password does not meet strength requirements',
                errors: passwordCheck.errors
            });
        }

        const user = await User.findById(req.user._id).select('+password');

        if (user.password) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    message: 'Current password is incorrect.'
                });
            }
        }

        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Request password reset
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            // Don't reveal if email exists (security best practice)
            return res.json({
                success: true,
                message: 'If that email address is in our system, we sent password reset instructions.'
            });
        }

        // Generate reset token
        const resetToken = randomBytes(32).toString('hex');
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
        await user.save();

        // Build reset link (adjust domain for production)
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        // Send email
        try {
            const { subject, htmlContent } = emailTemplates.passwordReset(resetLink);
            await sendEmail({
                to: user.email,
                subject,
                htmlContent
            });
        } catch (emailError) {
            console.error('Failed to send password reset email:', emailError);
            // Don't fail the request - token still works
        }

        res.json({
            success: true,
            message: 'If that email address is in our system, we sent password reset instructions.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token, email, newPassword } = req.body;

        // Validate new password strength
        const passwordCheck = validatePasswordStrength(newPassword);
        if (!passwordCheck.isStrong) {
            return res.status(400).json({
                success: false,
                message: 'Password does not meet strength requirements',
                errors: passwordCheck.errors
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            passwordResetToken: token,
            passwordResetExpires: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token.'
            });
        }

        // Set new password
        user.password = newPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();

        res.json({
            success: true,
            message: 'Password reset successfully. You can now log in with your new password.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout (clear token on frontend)
 * @route   POST /api/auth/logout
 */
export const logout = (req, res) => {
    res.json({
        success: true,
        message: 'Logged out successfully. Please clear your token from localStorage.'
    });
};
