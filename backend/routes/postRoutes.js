const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost } = require('../controllers/postController');
const { protect, admin } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getPosts)
  .post(protect, admin, imageUpload.single('image'), createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, admin, imageUpload.single('image'), updatePost)
  .delete(protect, admin, deletePost);

module.exports = router;