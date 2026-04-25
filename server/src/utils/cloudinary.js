import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Determine resource type and file category
 *
 * image → jpg, jpeg, png, gif, webp, svg, bmp
 * video → mp4, mov, avi, webm, mkv
 * raw   → pdf, doc, docx, xls, xlsx, txt, csv, ppt, pptx, zip
 *
 * NOTE: PDFs go as 'raw' so Cloudinary returns a direct download URL
 * instead of opening their viewer page
 */
const getFileInfo = (ext) => {
    const imageExts = ['jpg','jpeg','png','gif','webp','svg','bmp','tiff'];
    const videoExts = ['mp4','mov','avi','webm','mkv','flv','wmv','m4v'];

    if (imageExts.includes(ext)) return { resourceType: 'image', fileType: 'image'       };
    if (videoExts.includes(ext)) return { resourceType: 'video', fileType: 'video'       };

    // All documents go as raw — gives direct download URL
    const fileTypeMap = {
        pdf:  'pdf',
        doc:  'document', docx: 'document',
        xls:  'spreadsheet', xlsx: 'spreadsheet', csv: 'spreadsheet',
        ppt:  'document', pptx: 'document',
        txt:  'file',
        zip:  'file', rar: 'file'
    };
    return { resourceType: 'raw', fileType: fileTypeMap[ext] || 'file' };
};

/**
 * Upload a file buffer to Cloudinary
 * Returns { name, url, publicId, size, type, resourceType }
 */
export const uploadToCloudinary = (fileBuffer, folder, originalName) => {
    return new Promise((resolve, reject) => {
        const ext = originalName.split('.').pop().toLowerCase();
        const { resourceType, fileType } = getFileInfo(ext);

        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type:   resourceType,
                use_filename:    true,
                unique_filename: true,
                // For raw files, set attachment flag so browser downloads instead of opening
                ...(resourceType === 'raw' && {
                    type: 'upload',
                    access_mode: 'public'
                })
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload error:', error.message);
                    return reject(error);
                }

                // For raw files, append fl_attachment to URL for direct download
                let url = result.secure_url;
                if (resourceType === 'raw') {
                    // Insert fl_attachment flag into the URL
                    url = url.replace('/upload/', '/upload/fl_attachment/');
                }

                console.log(`✅ Uploaded: ${originalName} as ${resourceType} → ${url}`);
                resolve({
                    name:         originalName,
                    url,
                    publicId:     result.public_id,
                    size:         result.bytes || 0,
                    type:         fileType,
                    resourceType: resourceType
                });
            }
        );

        stream.end(fileBuffer);
    });
};

/**
 * Delete a file from Cloudinary
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        console.log(`🗑️ Deleted from Cloudinary: ${publicId}`);
    } catch (err) {
        console.error('Cloudinary delete error:', err.message);
    }
};

export default cloudinary;