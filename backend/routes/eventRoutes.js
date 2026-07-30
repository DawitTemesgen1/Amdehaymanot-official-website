const express = require('express');
const router = express.Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/eventController');
const { protect, admin } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, admin, imageUpload.single('image'), createEvent);

router.route('/:id')
  .put(protect, admin, imageUpload.single('image'), updateEvent)
  .delete(protect, admin, deleteEvent);

module.exports = router;