import { Router } from 'express';
import { upload, uploadFile, uploadMultipleFiles, deleteFile } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All upload routes require authentication
router.use(protect);

// Upload single file
router.post('/', upload.single('file'), uploadFile);

// Upload multiple files
router.post('/multiple', upload.array('files', 10), uploadMultipleFiles);

// Delete file - PROTECTED: only owner can delete
router.delete('/:publicId(*)', deleteFile);

export default router;
