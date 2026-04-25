import Client from '../models/Client.js';
import User from '../models/User.js';
import Update from '../models/Update.js';
import Note from '../models/Note.js';
import Project from '../models/Project.js';
import Comment from '../models/Comment.js';
import { sendClientWelcomeEmail } from '../utils/emailService.js';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

export const getClients = async (req, res, next) => {
    try {
        const clients = await Client.find({ agencyId: req.user._id }).sort({ createdAt: -1 });
        res.json({ success: true, clients });
    } catch (err) { next(err); }
};

export const getClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, agencyId: req.user._id });
        if (!client) return res.status(404).json({ success: false, message: 'Client not found.' });
        res.json({ success: true, client });
    } catch (err) { next(err); }
};

export const createClient = async (req, res, next) => {
    try {
        const { name, email, contactName, phone, company, industry, password } = req.body;

        if (!name || !email)
            return res.status(400).json({ success: false, message: 'Client name and email are required.' });

        const existingClient = await Client.findOne({ email: email.toLowerCase(), agencyId: req.user._id });
        if (existingClient)
            return res.status(400).json({ success: false, message: 'You already have a client with this email.' });

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser)
            return res.status(400).json({ success: false, message: 'An account with this email already exists.' });

        const clientPassword = (password && password.trim().length >= 6) ? password.trim() : 'ClientLoop@123';

        const client = await Client.create({
            name, email: email.toLowerCase(),
            contactName: contactName || '', phone: phone || '',
            company: company || '', industry: industry || '',
            agencyId: req.user._id
        });

        const clientUser = await User.create({
            name: contactName || name,
            email: email.toLowerCase(),
            password: clientPassword,
            role: 'client',
            clientId: client._id,
            company: company || name
        });

        client.userId = clientUser._id;
        await client.save();

        // Send welcome email with credentials
        sendClientWelcomeEmail({
            to:         email.toLowerCase(),
            clientName: contactName || name,
            agencyName: req.user.company || req.user.name,
            loginUrl:   `${CLIENT_URL}/client-login`,
            password:   clientPassword
        });

        res.status(201).json({
            success: true, client,
            portalPassword: clientPassword,
            message: 'Client created. Welcome email sent with login credentials.'
        });
    } catch (err) { next(err); }
};

export const updateClient = async (req, res, next) => {
    try {
        const { password, ...clientData } = req.body;

        const client = await Client.findOneAndUpdate(
            { _id: req.params.id, agencyId: req.user._id },
            clientData,
            { new: true, runValidators: true }
        );
        if (!client) return res.status(404).json({ success: false, message: 'Client not found.' });

        if (password && password.trim().length >= 6) {
            const clientUser = await User.findOne({ clientId: client._id, role: 'client' });
            if (clientUser) { clientUser.password = password.trim(); await clientUser.save(); }
        }
        if (clientData.email) {
            await User.findOneAndUpdate(
                { clientId: client._id, role: 'client' },
                { email: clientData.email.toLowerCase() }
            );
        }

        res.json({ success: true, client });
    } catch (err) { next(err); }
};

export const deleteClient = async (req, res, next) => {
    try {
        const client = await Client.findOne({ _id: req.params.id, agencyId: req.user._id });
        if (!client) return res.status(404).json({ success: false, message: 'Client not found.' });

        const projects   = await Project.find({ clientId: client._id });
        const projectIds = projects.map(p => p._id);
        const updates    = await Update.find({ projectId: { $in: projectIds } });
        const updateIds  = updates.map(u => u._id);

        await Comment.deleteMany({ updateId: { $in: updateIds } });
        await Update.deleteMany({ projectId: { $in: projectIds } });
        await Project.deleteMany({ clientId: client._id });
        await Note.deleteMany({ clientId: client._id });
        await User.deleteMany({ clientId: client._id, role: 'client' });
        await Client.findByIdAndDelete(client._id);

        res.json({ success: true, message: 'Client and all data deleted.' });
    } catch (err) { next(err); }
};