import Note from '../models/Note.js';
import Client from '../models/Client.js';

/**
 * @desc    Get all notes for a client
 * @route   GET /api/notes/client/:clientId
 */
export const getNotesByClient = async (req, res, next) => {
    try {
        // Make sure this client belongs to the agency
        const client = await Client.findOne({
            _id: req.params.clientId,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        const notes = await Note.find({ clientId: req.params.clientId })
            .sort({ createdAt: -1 });

        res.json({ success: true, notes });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a note for a client
 * @route   POST /api/notes
 */
export const createNote = async (req, res, next) => {
    try {
        const { clientId, content, type = 'note' } = req.body;

        if (!clientId || !content) {
            return res.status(400).json({
                success: false,
                message: 'Client ID and content are required.'
            });
        }

        // Verify client belongs to this agency
        const client = await Client.findOne({
            _id: clientId,
            agencyId: req.user._id
        });

        if (!client) {
            return res.status(404).json({
                success: false,
                message: 'Client not found.'
            });
        }

        const note = await Note.create({
            content,
            type,
            clientId,
            agencyId: req.user._id,
            authorName: req.user.name
        });

        res.status(201).json({ success: true, note });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a note
 * @route   DELETE /api/notes/:id
 */
export const deleteNote = async (req, res, next) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            agencyId: req.user._id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found.'
            });
        }

        res.json({ success: true, message: 'Note deleted.' });
    } catch (error) {
        next(error);
    }
};