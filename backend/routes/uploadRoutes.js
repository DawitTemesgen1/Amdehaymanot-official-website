const express = require('express');
const router = express.Router();
const { videoUpload } = require('../middleware/uploadMiddleware');
const { handleVideoUpload } = require('../controllers/uploadController');
const { protect, admin } = require('../middleware/authMiddleware');

// This route is now only for generic video uploads that return a file path
router.post('/video', protect, admin, videoUpload.single('video'), handleVideoUpload);

module.exports = router;