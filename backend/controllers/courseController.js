const Course = require('../models/course.model.js');
const Video = require('../models/video.model.js');
const { deleteFile } = require('../utils/fileHelper');

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (e) {
        res.status(500).json({ message: "Server Error" })
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(parseInt(req.params.id));
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.json(course);
    } catch (e) {
        res.status(500).json({ message: "Server Error" })
    }
};

exports.getCourseVideos = async (req, res) => {
    try {
        const videos = await Video.findByCourseId(parseInt(req.params.id));
        res.json(videos);
    } catch (e) {
        res.status(500).json({ message: "Server Error" })
    }
};

exports.getVideoDetails = async (req, res) => {
    try {
        const video = await Video.findDetailsById(parseInt(req.params.videoId), req.user.id);
        if (!video) return res.status(404).json({ message: "Video not found" });
        res.json(video);
    } catch (e) {
        res.status(500).json({ message: "Server Error" })
    }
};

exports.postComment = async (req, res) => {
    try {
        const { content } = req.body;
        const newComment = await Video.postComment({
            content,
            userId: req.user.id,
            videoId: parseInt(req.params.videoId)
        });
        res.status(201).json(newComment);
    } catch (e) {
        res.status(500).json({ message: "Server Error" })
    }
};

exports.toggleLikeVideo = async (req, res) => {
    const videoId = parseInt(req.params.videoId);
    const userId = req.user.id;
    try {
        const like = await Video.findLike(videoId, userId);
        if (like) {
            await Video.removeLike(like.id);
            res.json({ message: 'Unliked' });
        } else {
            await Video.addLike(videoId, userId);
            res.json({ message: 'Liked' });
        }
    } catch (e) {
        res.status(500).json({ message: "Server Error" })
    }
};

// ADMIN FUNCTIONS
exports.createCourse = async (req, res) => {
    const { title, description, category, instructor_name, course_type, schedule, live_session_url } = req.body;
    if (!title || !description || !category) {
        return res.status(400).json({ message: 'Title, Description, and Category are required.' });
    }
    try {
        const course = await Course.create({
            title, description, category, course_type, schedule, live_session_url,
            instructor_name: instructor_name || req.user.name,
            instructor_id: req.user.id,
            image_url: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : req.body.image_url || null,
        });
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: "Failed to create course", error: error.message });
    }
};

exports.updateCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const existingCourse = await Course.findById(id);
        if (!existingCourse) return res.status(404).json({ message: 'Course not found' });
        
        let newImageUrl = existingCourse.image_url;
        if (req.file) {
            newImageUrl = `/${req.file.path.replace(/\\/g, "/")}`;
            if (existingCourse.image_url) deleteFile(existingCourse.image_url);
        } else if (req.body.image_url !== undefined && req.body.image_url !== existingCourse.image_url) {
            newImageUrl = req.body.image_url;
        }

        const courseData = { ...existingCourse, ...req.body, image_url: newImageUrl };
        delete courseData.id; // remove id before update

        await Course.update(id, courseData);
        res.json({ id, ...courseData });
    } catch (error) {
        res.status(500).json({ message: "Failed to update course", error: error.message });
    }
};

exports.deleteCourse = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        
        const videos = await Video.findByCourseId(id);
        videos.forEach(video => {
            if (video.video_url && !video.video_url.includes('youtube.com') && !video.video_url.includes('youtu.be')) {
                deleteFile(video.video_url);
            }
        });

        if (course.image_url) deleteFile(course.image_url);

        await Course.delete(id);
        res.json({ message: 'Course and all its videos deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete course", error: error.message });
    }
};

exports.addVideoToCourse = async (req, res) => {
    const { title, video_url } = req.body;
    if (!title || !video_url) return res.status(400).json({ message: "Title and Video URL are required." });

    try {
        const video = await Video.create({
            title, video_url,
            courseId: parseInt(req.params.id)
        });
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add video to course.' });
    }
};

exports.deleteVideoFromCourse = async (req, res) => {
    const videoId = parseInt(req.params.videoId);
    try {
        const video = await Video.findById(videoId);
        if (!video) return res.status(404).json({ message: 'Video not found' });
        
        if (video.video_url && !video.video_url.includes('youtube.com') && !video.video_url.includes('youtu.be')) {
            deleteFile(video.video_url);
        }

        await Video.delete(videoId);
        res.json({ message: 'Video deleted from course.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete video.' });
    }
};