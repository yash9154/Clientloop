import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized. Please log in.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Invalid token.'
        });
    }
};

/**
 * Require agency role
 */
export const requireAgency = (req, res, next) => {
    if (req.user.role !== 'agency') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Agency account required.'
        });
    }
    next();
};

/**
 * Require client role
 */
export const requireClient = (req, res, next) => {
    if (req.user.role !== 'client') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Client account required.'
        });
    }
    next();
};
