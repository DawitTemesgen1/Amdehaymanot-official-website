const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
    getCategories,
    syncMezmurs,
    getAdminMezmurs,
    createMezmur,
    updateMezmur,
    deleteMezmur,
    createCategory,
    updateCategory,
    uploadAudio,
    uploadAudioTemp,
    previewDuplicates,
    rejectDuplicates
} = require('../controllers/mezmurController');
const { protect, admin } = require('../middleware/authMiddleware');

// Audio upload configuration
const audioStorage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads', 'mezmur_audio');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(null, `aud_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage: audioStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('audio/') || file.mimetype === 'video/mp4' || file.mimetype === 'application/octet-stream') {
            return cb(null, true);
        } else {
            cb(new Error('Audio files only!'));
        }
    }
});

// API Key Middleware for sync endpoints
const verifyApiKey = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    const serverKey = process.env.MEZMUR_SYNC_API_KEY || 'default-secret-key-123';
    
    if (!apiKey || apiKey !== serverKey) {
        return res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
    }
    next();
};

// ==========================================
// PUBLIC / SYNC ENDPOINTS (API Key Protected)
// ==========================================
router.get('/categories', verifyApiKey, getCategories);
router.get('/sync', verifyApiKey, syncMezmurs);

// ==========================================
// ADMIN ENDPOINTS (JWT Protected)
// ==========================================
router.route('/')
    .get(protect, admin, getAdminMezmurs)
    .post(protect, admin, createMezmur);

router.route('/:id')
    .put(protect, admin, updateMezmur)
    .delete(protect, admin, deleteMezmur);

router.post('/upload-audio', protect, admin, upload.single('audio'), uploadAudioTemp);
router.post('/:id/audio', protect, admin, upload.single('audio'), uploadAudio);

// Duplicate detection routes
router.get('/duplicates/preview', protect, admin, previewDuplicates);
router.post('/duplicates/reject', protect, admin, rejectDuplicates);

router.route('/category')
    .post(protect, admin, createCategory);

router.route('/category/:id')
    .put(protect, admin, updateCategory);

module.exports = router;
