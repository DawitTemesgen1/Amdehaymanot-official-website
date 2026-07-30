const express = require('express');
const router = express.Router();
const { 
    uploadBuild, getBuildsForAdmin, getBuildsForPublic, downloadBuild, 
    updateBuild, deleteBuild, incrementDownloadCount, getAppFeedback, 
    postAppComment, likeApp 
} = require('../controllers/appController');
const { protect, admin } = require('../middleware/authMiddleware');
const { appUpload } = require('../middleware/uploadMiddleware');

// ADMIN ROUTES
router.post('/upload', protect, admin, appUpload.single('appfile'), uploadBuild);
router.get('/builds', protect, admin, getBuildsForAdmin);
router.route('/builds/:id')
    .put(protect, admin, appUpload.single('appfile'), updateBuild)
    .delete(protect, admin, deleteBuild);

// PUBLIC ROUTES
router.get('/builds/public', getBuildsForPublic);
router.get('/download/:architecture', downloadBuild);
router.post('/download/:architecture/count', incrementDownloadCount);
router.get('/feedback', getAppFeedback);
router.post('/comments', postAppComment);
router.post('/like', likeApp);

module.exports = router;