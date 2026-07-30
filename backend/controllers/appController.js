const App = require('../models/app.model');
const path = require('path');
const fs = require('fs');
const { deleteFile } = require('../utils/fileHelper');

exports.uploadBuild = async (req, res) => {
    const { version, platform, architecture, notes } = req.body;
    if (!req.file || !version || !platform || !architecture) {
        return res.status(400).json({ message: "File, Version, Platform, and Architecture are required." });
    }
    try {
        const existingBuild = await App.findByArchitecture(architecture);
        if (existingBuild) {
            return res.status(400).json({ message: `A build for ${architecture} already exists. Please use the update functionality.` });
        }
        const build = await App.createBuild({
            version, platform, architecture, notes, 
            filePath: `/${req.file.path.replace(/\\/g, "/")}` 
        });
        res.status(201).json({ message: "App build uploaded successfully!", build });
    } catch (error) {
        console.error("Backend Error in uploadBuild:", error);
        res.status(500).json({ message: "Server error during app upload." });
    }
};

exports.updateBuild = async (req, res) => {
    const { version, notes } = req.body;
    try {
        const buildId = parseInt(req.params.id);
        const existingBuild = await App.findById(buildId);
        if (!existingBuild) return res.status(404).json({ message: "Build not found." });

        let newFilePath = existingBuild.file_path;
        if (req.file) {
            newFilePath = `/${req.file.path.replace(/\\/g, "/")}`;
            if (existingBuild.file_path) deleteFile(existingBuild.file_path);
        }

        const updatedData = {
            version: version || existingBuild.version,
            notes: notes || existingBuild.notes,
            file_path: newFilePath,
        };
        await App.updateBuild(buildId, updatedData);
        res.json({ message: "Build updated successfully!", build: { id: buildId, ...updatedData } });
    } catch (error) {
        console.error("Backend Error in updateBuild:", error);
        res.status(500).json({ message: "Server error updating build." });
    }
};

exports.deleteBuild = async (req, res) => {
    try {
        const buildId = parseInt(req.params.id);
        const build = await App.findById(buildId);
        if (!build) return res.status(404).json({ message: "Build not found." });

        if (build.file_path) deleteFile(build.file_path);
        
        await App.deleteBuild(buildId);
        res.json({ message: "Build deleted successfully." });
    } catch (error) {
        console.error("Backend Error in deleteBuild:", error);
        res.status(500).json({ message: "Server error deleting build." });
    }
};

exports.getBuildsForAdmin = async (req, res) => {
    try {
        const builds = await App.findAll();
        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching builds for admin." });
    }
};

exports.getBuildsForPublic = async (req, res) => {
    try {
        const builds = await App.findAll();
        res.json(builds);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching public builds." });
    }
};

exports.downloadBuild = async (req, res) => {
    try {
        const { architecture } = req.params;
        const build = await App.findByArchitecture(architecture);
        if (!build || !build.file_path) return res.status(404).json({ message: `No build found for architecture: ${architecture}` });
        
        const filePath = path.join(process.cwd(), build.file_path);
        if (fs.existsSync(filePath)) {
            res.download(filePath);
        } else {
            res.status(404).json({ message: "File not found on server." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during download." });
    }
};

exports.incrementDownloadCount = async (req, res) => {
    try {
        await App.incrementDownloadCount(req.params.architecture);
        res.status(200).json({ message: "Count updated." });
    } catch (error) {
        res.status(500).json({ message: "Server error during count update." });
    }
};

exports.getAppFeedback = async (req, res) => {
    try {
        const feedback = await App.getFeedback();
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: "Server error fetching feedback." });
    }
};

exports.postAppComment = async (req, res) => {
    const { authorName, content } = req.body;
    if (!authorName || !content) {
        return res.status(400).json({ message: "Name and comment are required." });
    }
    try {
        const comment = await App.createComment({ authorName, content });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Server error posting comment." });
    }
};

exports.likeApp = async (req, res) => {
    const { architecture } = req.body;
    if (!architecture) return res.status(400).json({ message: "App architecture is required." });
    
    try {
        const updatedBuild = await App.likeBuild(architecture);
        if (updatedBuild) {
             res.status(200).json({ newLikeCount: updatedBuild.likes });
        } else {
            res.status(404).json({ message: `Build for ${architecture} not found.` });
        }
    } catch (error) {
        res.status(404).json({ message: `Error liking build.` });
    }
};