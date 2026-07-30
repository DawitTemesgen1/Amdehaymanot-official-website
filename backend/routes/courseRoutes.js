const express = require('express');
const router = express.Router();
const { getCourses, createCourse, updateCourse, deleteCourse, getCourseById, getCourseVideos, addVideoToCourse, deleteVideoFromCourse, getVideoDetails, postComment, toggleLikeVideo } = require('../controllers/courseController');
const { protect, admin } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getCourses)
  .post(protect, admin, imageUpload.single('image'), createCourse);

router.route('/:id')
  .get(getCourseById)
  .put(protect, admin, imageUpload.single('image'), updateCourse)
  .delete(protect, admin, deleteCourse);

router.route('/:id/videos')
  .get(getCourseVideos)
  .post(protect, admin, addVideoToCourse);

router.route('/:id/videos/:videoId')
  .get(protect, getVideoDetails)
  .delete(protect, admin, deleteVideoFromCourse);

router.post('/:id/videos/:videoId/comments', protect, postComment);
router.post('/:id/videos/:videoId/like', protect, toggleLikeVideo);

module.exports = router;