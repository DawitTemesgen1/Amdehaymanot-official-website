const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
// Assume we have some kind of admin auth middleware in the future.
// For now we just route directly as other admin routes do.

router.get('/', submissionController.listSubmissions);
router.post('/:id/approve', submissionController.approveSubmission);
router.post('/:id/reject', submissionController.rejectSubmission);

module.exports = router;
