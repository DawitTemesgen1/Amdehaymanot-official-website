const express = require('express');
const router = express.Router();
const { submitMessage, getMessages } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(submitMessage) // Public can post
  .get(protect, admin, getMessages); // Admin can get

module.exports = router;