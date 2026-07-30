const controller = require("../controllers/videoController.js");
const { verifyToken, isTeacher, isCourseOwner } = require("../middleware/authMiddleware.js");
const router = require("express").Router({ mergeParams: true });

// Admin/Teacher Routes
router.post("/", [verifyToken, isTeacher, isCourseOwner], controller.create);
router.delete("/:videoId", [verifyToken, isTeacher, isCourseOwner], controller.delete);

// Public/User Routes
router.get("/", controller.findByCourse);
router.get("/:videoId", controller.findOneWithDetails); // Get video with comments/likes

// Logged-in User Routes
router.post("/:videoId/comments", [verifyToken], controller.addComment);
router.post("/:videoId/like", [verifyToken], controller.addLike);

module.exports = router;