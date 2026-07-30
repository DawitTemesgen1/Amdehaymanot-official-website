const Gallery = require('../models/gallery.model');
const { deleteFile } = require('../utils/fileHelper');
const archiver = require('archiver');
const path = require('path');
const fs = require('fs');

exports.getCategories = async (req, res) => {
    try {
        const categories = await Gallery.findAllCategories();
        res.json(categories);
    } catch (e) {
        res.status(500).json({ message: "Could not fetch categories." });
    }
};
exports.createCategory = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required." });
    try {
        const newCategory = await Gallery.createCategory({ name });
        res.status(201).json(newCategory);
    } catch (e) {
        if (e.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "A category with this name already exists." });
        res.status(500).json({ message: "Could not create category." });
    }
};
exports.deleteCategory = async (req, res) => {
    try {
        await Gallery.deleteCategory(parseInt(req.params.id));
        res.json({ message: 'Category deleted successfully' });
    } catch (e) {
        res.status(500).json({ message: 'Could not delete category.' });
    }
};

exports.getAlbums = async (req, res) => {
    try {
        const albums = await Gallery.findAllAlbums();
        res.json(albums);
    } catch (e) {
        res.status(500).json({ message: "Could not fetch albums." });
    }
};
exports.getAlbumById = async (req, res) => {
    try {
        const album = await Gallery.findAlbumById(parseInt(req.params.id));
        if (!album) return res.status(404).json({ message: "Album not found." });
        res.json(album);
    } catch (e) {
        res.status(500).json({ message: "A server error occurred." });
    }
};
exports.createAlbum = async (req, res) => {
    const { title, description, categoryId } = req.body;
    try {
        const album = await Gallery.createAlbum({
            title,
            description: description || null,
            categoryId: categoryId ? parseInt(categoryId) : null,
            cover_image_url: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : null
        });
        res.status(201).json(album);
    } catch (e) {
        res.status(500).json({ message: "Could not create album." });
    }
};
exports.updateAlbum = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const album = await Gallery.findAlbumById(id);
        if(!album) return res.status(404).json({ message: "Album not found "});

        let newCoverUrl = album.cover_image_url;
        if(req.file){
            newCoverUrl = `/${req.file.path.replace(/\\/g, "/")}`;
            if(album.cover_image_url) deleteFile(album.cover_image_url);
        }
        
        const data = {...req.body, cover_image_url: newCoverUrl};
        if(data.categoryId) data.categoryId = parseInt(data.categoryId);

        await Gallery.updateAlbum(id, data);
        res.json({ message: "Album updated" });
    } catch (e) {
         res.status(500).json({ message: "Could not update album." });
    }
};
exports.deleteAlbum = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const album = await Gallery.findAlbumById(id);
        if (!album) return res.status(404).json({ message: "Album not found" });

        if (album.cover_image_url) deleteFile(album.cover_image_url);
        album.images.forEach(img => deleteFile(img.image_url));
        album.images.forEach(img => deleteFile(img.thumbnail_url));

        await Gallery.deleteAlbum(id);
        res.json({ message: "Album deleted successfully" });
    } catch (e) {
        res.status(500).json({ message: "Could not delete album." });
    }
};

exports.addImagesToAlbum = async (req, res) => {
    // This assumes `uploadController` has run and `req.processedFiles` exists
    if (!req.processedFiles || req.processedFiles.length === 0) {
        return res.status(400).json({ message: "No processed files found." });
    }
    const albumId = parseInt(req.params.id);
    try {
        const imagesData = req.processedFiles.map(file => [
            albumId,
            req.body.title || 'Untitled',
            file.image_url,
            file.thumbnail_url
        ]);

        await Gallery.addImagesToAlbum(imagesData);
        res.status(201).json({ message: "Images added successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error adding images to database" });
    }
};
exports.deleteImageFromAlbum = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const image = await Gallery.findImageById(id);
        if (!image) return res.status(404).json({ message: "Image not found" });
        
        deleteFile(image.image_url);
        deleteFile(image.thumbnail_url);
        
        await Gallery.deleteImage(id);
        res.json({ message: "Image deleted" });
    } catch (e) {
        res.status(500).json({ message: "Could not delete image" });
    }
};
exports.likeImage = async (req, res) => {
    try {
        await Gallery.likeImage(parseInt(req.params.id));
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
};
exports.downloadImage = async (req, res) => {
    try {
        const image = await Gallery.findImageById(parseInt(req.params.id));
        if (!image || !image.image_url) return res.status(404).send('File not found.');

        const filePath = path.join(process.cwd(), image.image_url);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).send('File not found on server.');
        }
    } catch (e) {
        res.status(500).send('Error processing download.');
    }
};
exports.downloadAlbumAsZip = async (req, res) => {
    try {
        const album = await Gallery.findAlbumById(parseInt(req.params.id));
        if (!album || album.images.length === 0) return res.status(404).send('No images in album.');
        
        const zipFileName = `${album.title.replace(/\s+/g, '-')}.zip`;
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);

        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);

        album.images.forEach(img => {
            const filePath = path.join(process.cwd(), img.image_url);
            if (fs.existsSync(filePath)) archive.file(filePath, { name: path.basename(filePath) });
        });
        
        await archive.finalize();
    } catch (e) {
        res.status(500).send('Error creating zip file.');
    }
};