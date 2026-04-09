import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Upload a file buffer to Cloudinary
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: options.folder || 'clientloop',
            resource_type: 'auto',
            ...options
        };

        const uploadStream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        uploadStream.end(fileBuffer);
    });
};

/**
 * Delete a file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

/**
 * Format file size to human readable string
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * Get file type from filename
 */
export const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const types = {
        pdf: 'pdf', doc: 'document', docx: 'document', txt: 'document', rtf: 'document',
        xls: 'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
        jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
        psd: 'design', ai: 'design', sketch: 'design', fig: 'design', xd: 'design',
        zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive',
        mp4: 'video', mov: 'video', avi: 'video', webm: 'video',
        mp3: 'audio', wav: 'audio', m4a: 'audio'
    };
    return types[ext] || 'file';
};

export default cloudinary;
