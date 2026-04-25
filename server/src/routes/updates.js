import express from 'express';
import multer from 'multer';
import {
    getUpdatesByProject,
    getUpdatesByProjectForClient,
    getMyUpdates,
    createUpdate,
    editUpdate,
    deleteUpdate,
    removeFile,
    approveUpdate,
    requestChanges
} from '../controllers/updateController.js';
import { protect, requireAgency, requireClient } from '../middleware/auth.js';

const router = express.Router();

// Allowed MIME types
const ALLOWED_MIMES = [
    // Images
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'image/svg+xml', 'image/bmp', 'image/tiff',
    // PDF
    'application/pdf',
    // Word
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    // Excel
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // PowerPoint
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    // Text / CSV
    'text/plain', 'text/csv',
    // Video
    'video/mp4', 'video/quicktime', 'video/x-msvideo',
    'video/webm', 'video/x-matroska', 'video/x-flv', 'video/x-ms-wmv',
    // Archives
    'application/zip', 'application/x-rar-compressed'
];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024,  // 50MB per file (videos need more space)
        files: 5
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_MIMES.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed: ${file.mimetype}`), false);
        }
    }
});

// ── CLIENT ROUTES (static before dynamic) ────────────────────────
router.get('/my-updates',                protect, requireClient, getMyUpdates);
router.get('/project/:projectId/client', protect, requireClient, getUpdatesByProjectForClient);
router.put('/:id/approve',               protect, requireClient, approveUpdate);
router.put('/:id/request-changes',       protect, requireClient, requestChanges);

// ── AGENCY ROUTES ─────────────────────────────────────────────────
router.get('/project/:projectId',        protect, requireAgency, getUpdatesByProject);
router.post('/',                         protect, requireAgency, upload.array('files', 5), createUpdate);
router.put('/:id',                       protect, requireAgency, upload.array('files', 5), editUpdate);
router.delete('/:id',                    protect, requireAgency, deleteUpdate);
router.delete('/:id/files/:publicId',    protect, requireAgency, removeFile);

export default router;