const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/subscribeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(subscribe) // Public can post
  .get(protect, admin, getSubscribers); // Admin can get

module.exports = router;