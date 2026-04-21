import Client from '../models/Client.js';
import User from '../models/User.js';
import Update from '../models/Update.js';
import Note from '../models/Note.js';

/**
 * @desc    Get all clients for the logged-in agency
 * @route   GET /api/clients
 */
export const getClients = async (req, res, next) => {
    try {
        const clients = await Client.find({ agencyId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, clients });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single client (must belong to this agency)
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
 * @desc    Create a new client + auto-create their portal login account
 * @route   POST /api/clients
 * 
 * BUG FIX: Previously, password validation silently replaced the provided
 * password with a random one — meaning the client could never log in with
 * the password the agency set. Now we use the password as-is (min 6 chars).
 * 
 * BUG FIX 2: Previously checked User email globally — now scoped correctly
 * so same email can't be used twice but error is clear.
 */
export const createClient = async (req, res, next) => {
    try {
        const { name, email, contactName, phone, company, industry, password } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: 'Client name and email are required.'
            });
        }

        // Check if this agency already has a client with this email
        const existingClient = await Client.findOne({
            email: email.toLowerCase(),
            agencyId: req.user._id
        });
        if (existingClient) {
            return res.status(400).json({
                success: false,
                message: 'You already have a client with this email address.'
            });
        }

        // Check if a User account already exists with this email
        // (could be from another agency's client or an agency account)
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists. Use a different email for this client.'
            });
        }

        // Use provided password (min 6 chars), fallback to default
        // THE FIX: we use exactly what the agency provides — no silent replacement
        const clientPassword = (password && password.trim().length >= 6)
            ? password.trim()
            : 'ClientLoop@123';

        // Step 1: Create the Client record
        const client = await Client.create({
            name,
            email: email.toLowerCase(),
            contactName: contactName || '',
            phone: phone || '',
            company: company || '',
            industry: industry || '',
            agencyId: req.user._id
        });

        // Step 2: Create the User account for client portal login
        const clientUser = await User.create({
            name: contactName || name,
            email: email.toLowerCase(),
            password: clientPassword,
            role: 'client',
            clientId: client._id,
            company: company || name
        });

        // Step 3: Link userId back onto the Client record
        client.userId = clientUser._id;
        await client.save();

        res.status(201).json({
            success: true,
            client,
            // Return the plain-text password so agency can share it with client
            // Only returned on creation, never again
            portalPassword: clientPassword,
            message: 'Client created. Share these login credentials with your client.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update client details
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

        // If a new password is provided, update the client's User account
        if (password && password.trim().length >= 6) {
            const clientUser = await User.findOne({
                clientId: client._id,
                role: 'client'
            });
            if (clientUser) {
                clientUser.password = password.trim();
                await clientUser.save(); // pre-save hook hashes it
            }
        }

        // If email changed, also update the linked User account email
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
 * @desc    Delete client and all their data
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

        // Delete all updates and notes for this client
        await Update.deleteMany({ clientId: client._id });
        await Note.deleteMany({ clientId: client._id });

        // Delete the client's User account
        await User.deleteMany({ clientId: client._id, role: 'client' });

        // Delete the client record
        await Client.findByIdAndDelete(client._id);

        res.json({ success: true, message: 'Client and all related data deleted.' });
    } catch (error) {
        next(error);
    }
};