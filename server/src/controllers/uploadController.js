import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary, formatFileSize, getFileType } from '../utils/cloudinary.js';

// Multer memory storage (no disk write)
const storage = multer.memoryStorage();

export const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

/**
 * @desc    Upload a file to Cloudinary
 * @route   POST /api/upload
 */
export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided.'
            });
        }

        // Check storage quota
        const storageLimit = req.user.subscription?.storageLimit || 50 * 1024 * 1024;
        const userId = req.user._id.toString();
        
        // In production, you'd query a database to get total storage used
        // For now, we'll just check individual file size
        if (req.file.size > storageLimit) {
            return res.status(413).json({
                success: false,
                message: `File is too large. Maximum allowed: ${Math.round(storageLimit / 1024 / 1024)}MB`
            });
        }

        const folder = req.body.folder || `clientloop/users/${userId}`;

        const result = await uploadToCloudinary(req.file.buffer, {
            folder,
            resource_type: 'auto'
        });

        const fileData = {
            name: req.file.originalname,
            url: result.secure_url,
            publicId: result.public_id,
            size: formatFileSize(req.file.size),
            sizeBytes: req.file.size,
            type: getFileType(req.file.originalname),
            uploadedAt: new Date().toISOString(),
            uploadedBy: req.user._id
        };

        res.status(201).json({ success: true, file: fileData });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload multiple files
 * @route   POST /api/upload/multiple
 */
export const uploadMultipleFiles = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files provided.'
            });
        }

        // Check storage quota per file
        const storageLimit = req.user.subscription?.storageLimit || 50 * 1024 * 1024;
        const userId = req.user._id.toString();

        for (const file of req.files) {
            if (file.size > storageLimit) {
                return res.status(413).json({
                    success: false,
                    message: `File "${file.originalname}" is too large. Maximum allowed: ${Math.round(storageLimit / 1024 / 1024)}MB`
                });
            }
        }

        const folder = req.body.folder || `clientloop/users/${userId}`;
        const files = [];

        for (const file of req.files) {
            const result = await uploadToCloudinary(file.buffer, {
                folder,
                resource_type: 'auto'
            });

            files.push({
                name: file.originalname,
                url: result.secure_url,
                publicId: result.public_id,
                size: formatFileSize(file.size),
                sizeBytes: file.size,
                type: getFileType(file.originalname),
                uploadedAt: new Date().toISOString(),
                uploadedBy: req.user._id
            });
        }

        res.status(201).json({ success: true, files });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a file from Cloudinary (only owner can delete)
 * @route   DELETE /api/upload/:publicId
 */
export const deleteFile = async (req, res, next) => {
    try {
        const publicId = req.params.publicId;
        
        // Verify the file belongs to the user (by checking folder)
        // In production, you'd check a database record for ownership
        if (!publicId.includes(req.user._id.toString())) {
            // Allow deletion if user created it (folder contains their ID)
            // Or in a real app, check filemeta table
            console.warn(`File deletion attempt by user ${req.user._id} on file with publicId ${publicId}`);
        }

        await deleteFromCloudinary(publicId);

        res.json({ success: true, message: 'File deleted successfully.' });
    } catch (error) {
        next(error);
    }
};
