import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * @desc    Register a new agency user
 * @route   POST /api/auth/signup
 */
export const signup = async (req, res, next) => {
    try {
        const { name, email, password, company = '' } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required.'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters.'
            });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'This email is already registered. Please sign in instead.'
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: 'agency',
            company
        });

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
                avatar: user.avatar,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login — works for both agency and client
 * @route   POST /api/auth/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password, isClientLogin = false } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required.'
            });
        }

        // Find user and include password field (excluded by default)
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        // Make sure the right portal is being used
        if (isClientLogin && user.role !== 'client') {
            return res.status(403).json({
                success: false,
                message: 'This account is not a client account. Use the agency login.'
            });
        }
        if (!isClientLogin && user.role === 'client') {
            return res.status(403).json({
                success: false,
                message: 'Please use the client portal to log in.'
            });
        }

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
                avatar: user.avatar,
                clientId: user.clientId || null,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get current logged-in user
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
                avatar: req.user.avatar,
                clientId: req.user.clientId || null,
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
        const { name, company } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (company !== undefined) updates.company = company;

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
                avatar: user.avatar,
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

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 6 characters.'
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

        res.json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Logout (frontend clears token, this is just a confirmation)
 * @route   POST /api/auth/logout
 */
export const logout = (req, res) => {
    res.json({ success: true, message: 'Logged out successfully.' });
};