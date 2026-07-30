const sharp = require('sharp');
const path = require('path');

// This controller now acts more like a middleware, processing files and attaching them to the request
// The actual database insertion is handled in the galleryController

// Handler for gallery images (uses sharp for processing)
exports.processAndAttachMany = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send({ message: 'No image files were uploaded.' });
    }
    try {
        req.processedFiles = await Promise.all(req.files.map(async (file) => {
            const timestamp = Date.now();
            const originalName = path.parse(file.originalname).name.replace(/[^a-zA-Z0-9]/g, '_');
            
            // Note: multer.diskStorage saves to a temp location. We use the buffer for sharp.
            const fullSizeFilename = `${timestamp}-${originalName}.webp`;
            const thumbFilename = `${timestamp}-${originalName}-thumb.webp`;
            
            // Use the file path from multer's disk storage
            const fullSizePath = path.join('uploads/images', fullSizeFilename);
            const thumbPath = path.join('uploads/images', thumbFilename);
            
            await sharp(file.path).resize({ width: 1920, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toFile(fullSizePath);
            await sharp(file.path).resize({ width: 400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 70 }).toFile(thumbPath);
            
            return { 
                image_url: `/uploads/images/${fullSizeFilename}`, 
                thumbnail_url: `/uploads/images/${thumbFilename}` 
            };
        }));
        // Proceed to the next middleware/controller in the chain (e.g., galleryController.addImagesToAlbum)
        next();
    } catch (error) {
        console.error("Image processing error:", error);
        res.status(500).send({ message: 'An error occurred while processing images.' });
    }
};

// Handler for a single video upload
exports.handleVideoUpload = (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No video file was uploaded.' });
    }
    // Return the public path to the saved video file
    res.status(201).send({
        message: 'Video uploaded successfully',
        filePath: `/${req.file.path.replace(/\\/g, "/")}`
    });
};