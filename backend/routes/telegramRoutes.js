const express = require('express');
const router = express.Router();
const { handleWebhook, webhookHealth } = require('../controllers/telegramController');

router.get('/webhook', webhookHealth);
router.post('/webhook', handleWebhook);

module.exports = router;
