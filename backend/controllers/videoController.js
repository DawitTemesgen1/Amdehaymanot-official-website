
const Video = require("../models/videoModel.js");

exports.create = (req, res) => {
    const videoData = { ...req.body, course_id: req.params.courseId };
    Video.create(videoData, (err, data) => {
        if (err) return res.status(500).send({ message: "Error adding video." });
        res.status(201).send(data);
    });
};

// --- THIS IS THE FIX for the infinite loading page ---
// This function finds all videos associated with a specific course ID.
exports.findByCourse = (req, res) => {
    Video.findByCourseId(req.params.courseId, (err, data) => {
        if (err) {
            return res.status(500).send({ message: "Error retrieving videos for this course." });
        }
        res.send(data);
    });
};
// --- No changes to other functions ---
exports.findAll = (req, res) => {
    Course.findAll((err, data) => {
        if (err) return res.status(500).send({ message: "Error retrieving courses." });
        res.send(data);
    });
};

exports.findOne = (req, res) => {
    Course.findById(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") return res.status(404).send({ message: `Course with id ${req.params.id} not found.` });
            return res.status(500).send({ message: "Error retrieving course." });
        }
        res.send(data);
    });
};

exports.delete = (req, res) => {
    Course.delete(req.params.id, (err, data) => {
        if (err) return res.status(500).send({ message: "Error deleting course." });
        res.send({ message: "Course was deleted successfully." });
    });
};

exports.findMyCourses = (req, res) => {
    Course.findByInstructorId(req.userId, (err, data) => {
        if (err) return res.status(500).send({ message: "Error fetching your courses." });
        res.send(data);
    });
};

exports.findOneWithDetails = (req, res) => {
    Video.findById(req.params.videoId, (err, video) => {
        if (err || !video) return res.status(404).send({ message: "Video not found." });
        Video.getCommentsByVideoId(req.params.videoId, (comErr, comments) => {
            Video.getLikeCount(req.params.videoId, (likeErr, likeCount) => {
                if (comErr || likeErr) return res.status(500).send({ message: "Error fetching details." });
                video.comments = comments;
                video.likes = likeCount[0].like_count;
                res.send(video);
            });
        });
    });
};

exports.delete = (req, res) => {
    Video.delete(req.params.videoId, (err, data) => {
        if (err) {
             if (err.kind === "not_found") {
                return res.status(404).send({ message: `Video with id ${req.params.videoId} not found.` });
            }
            return res.status(500).send({ message: "Could not delete video." });
        }
        res.send({ message: "Video was deleted successfully!" });
    });
};

// Interaction Controllers
exports.addComment = (req, res) => {
    const commentData = { content: req.body.content, video_id: req.params.videoId, user_id: req.userId };
    Video.addComment(commentData, (err, data) => {
        if (err) return res.status(500).send({ message: "Failed to post comment." });
        res.status(201).send({ message: "Comment posted." });
    });
};

exports.addLike = (req, res) => {
    const likeData = { video_id: req.params.videoId, user_id: req.userId };
    Video.addLike(likeData, (err, data) => {
        if (err) return res.status(500).send({ message: "Failed to like video." });
        res.status(201).send({ message: "Video liked." });
    });
};