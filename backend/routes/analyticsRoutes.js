const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// In a real app, you would add an authMiddleware here to protect the route
router.get('/stats', analyticsController.getAnalyticsStats);

module.exports = router;
