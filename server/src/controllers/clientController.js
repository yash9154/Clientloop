import Client from '../models/Client.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Update from '../models/Update.js';
import Comment from '../models/Comment.js';
import { generateSecurePassword, validatePasswordStrength } from '../utils/passwordValidator.js';
import { sendEmail, emailTemplates } from '../utils/emailService.js';

/**
 * @desc    Get all clients for the agency (with pagination)
 * @route   GET /api/clients
 */
export const getClients = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const clients = await Client.find({ agencyId: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Client.countDocuments({ agencyId: req.user._id });

        res.json({
            success: true,
            clients,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: page,
                limit
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single client
 * @route   GET /api/clients/:id
 */
export const getClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        res.json({ success: true, client });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new client + auto-create a User account for client portal login
 * @route   POST /api/clients
 */
export const createClient = async (req, res, next) => {
    try {
        // Check subscription limits
        const clientCount = await Client.countDocuments({ agencyId: req.user._id });
        const limit = req.user.subscription?.clientLimit || 1;

        if (clientCount >= limit) {
            return res.status(403).json({
                success: false,
                message: `You have reached your client limit (${limit}). Please upgrade your plan.`
            });
        }

        const { name, email, contactName, phone, company, industry, password } = req.body;

        // Check if a User with this email already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'A user with this email already exists. Please use a different email.'
            });
        }

        // 1. Create the Client record
        const client = await Client.create({
            name,
            email: email.toLowerCase(),
            contactName: contactName || '',
            phone: phone || '',
            company: company || '',
            industry: industry || '',
            agencyId: req.user._id
        });

        // 2. Auto-create a User account for client portal login
        // Use provided password if strong, otherwise generate secure one
        let clientPassword;
        if (password) {
            const passwordCheck = validatePasswordStrength(password);
            if (!passwordCheck.isStrong) {
                clientPassword = generateSecurePassword(12);
            } else {
                clientPassword = password;
            }
        } else {
            clientPassword = generateSecurePassword(12);
        }

        const clientUser = await User.create({
            name: contactName || name,
            email: email.toLowerCase(),
            password: clientPassword,
            role: 'client',
            clientId: client._id,
            company: company || name
        });

        // 3. Store the userId back on the Client record
        client.userId = clientUser._id;
        await client.save();

        // 4. Send welcome email with login credentials
        try {
            const { subject, htmlContent } = emailTemplates.clientCreated(
                contactName || name,
                email.toLowerCase(),
                clientPassword,
                req.user.company || 'Your Agency'
            );
            
            await sendEmail({
                to: email.toLowerCase(),
                subject,
                htmlContent
            });
        } catch (emailError) {
            // Log error but don't fail the request
            console.error('Failed to send client welcome email:', emailError);
        }

        res.status(201).json({ 
            success: true, 
            client,
            message: 'Client created successfully and welcome email sent.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a client (and optionally update their User account password)
 * @route   PUT /api/clients/:id
 */
export const updateClient = async (req, res, next) => {
    try {
        const { password, ...clientData } = req.body;

        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user._id },
            clientData,
            { new: true, runValidators: true }
        );

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        // If password is provided, update the User account password
        if (password && password.trim()) {
            // Validate password strength
            const passwordCheck = validatePasswordStrength(password);
            if (!passwordCheck.isStrong) {
                return res.status(400).json({
                    success: false,
                    message: 'New password does not meet strength requirements',
                    errors: passwordCheck.errors
                });
            }

            const clientUser = await User.findOne({
                clientId: client._id,
                role: 'client'
            });
            if (clientUser) {
                clientUser.password = password;
                await clientUser.save(); // triggers password hashing via pre-save hook
            }
        }

        // If email changed, also update the User account email
        if (clientData.email) {
            await User.findOneAndUpdate(
                { clientId: client._id, role: 'client' },
                { email: clientData.email.toLowerCase() }
            );
        }

        res.json({ success: true, client });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a client, their User account, and all related data
 * @route   DELETE /api/clients/:id
 */
export const deleteClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({
            _id: req.params.id,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        // Delete all related projects, updates, comments (soft delete would be better)
        const projects = await Project.find({ clientId: client._id });
        const projectIds = projects.map(p => p._id);

        const updates = await Update.find({ projectId: { $in: projectIds } });
        const updateIds = updates.map(u => u._id);

        await Comment.deleteMany({ updateId: { $in: updateIds } });
        await Update.deleteMany({ projectId: { $in: projectIds } });
        await Project.deleteMany({ clientId: client._id });

        // Delete the associated User account
        await User.deleteMany({ clientId: client._id, role: 'client' });

        await Client.findByIdAndDelete(client._id);

        res.json({
            success: true,
            message: 'Client and all related data deleted.'
        });
    } catch (error) {
        next(error);
    }
};
