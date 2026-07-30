const express = require('express');
const router = express.Router();
const {
    getCategories, createCategory, deleteCategory,
    getAlbums, createAlbum, getAlbumById, updateAlbum, deleteAlbum, downloadAlbumAsZip,
    addImagesToAlbum, deleteImageFromAlbum, likeImage, downloadImage,
} = require('../controllers/galleryController');
const { processAndAttachMany } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

// CATEGORY ROUTES
router.route('/categories').get(getCategories).post(protect, admin, createCategory);
router.route('/categories/:id').delete(protect, admin, deleteCategory);

// ALBUM ROUTES
router.route('/albums').get(getAlbums).post(protect, admin, imageUpload.single('cover_image_url'), createAlbum);
router.route('/albums/:id').get(getAlbumById).put(protect, admin, imageUpload.single('cover_image_url'), updateAlbum).delete(protect, admin, deleteAlbum);
router.route('/albums/:id/download').get(downloadAlbumAsZip);

// IMAGE ROUTES
router.route('/albums/:id/images').post(protect, admin, imageUpload.array('images', 20), processAndAttachMany, addImagesToAlbum);
router.route('/images/:id').delete(protect, admin, deleteImageFromAlbum);
router.route('/images/:id/like').post(likeImage);
router.route('/images/:id/download').get(downloadImage);

module.exports = router;