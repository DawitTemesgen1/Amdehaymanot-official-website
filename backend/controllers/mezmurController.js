const Mezmur = require('../models/mezmur.model');
const MezmurCategory = require('../models/mezmurCategory.model');
const fs = require('fs');
const path = require('path');
const { convertAudio } = require('../services/audioConverter');

// ==========================================
// PUBLIC / SYNC ENDPOINTS
// ==========================================

// GET /api/mezmur/categories (Public/Sync)
exports.getCategories = async (req, res) => {
    try {
        const categories = await MezmurCategory.findAll();
        res.json(categories);
    } catch (error) {
        console.error("Error fetching mezmur categories:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// GET /api/mezmur/sync?since_version= (Sync API)
exports.syncMezmurs = async (req, res) => {
    try {
        const sinceVersion = parseInt(req.query.since_version) || 0;
        
        const currentVersion = await Mezmur.getCurrentSyncVersion();
        
        if (sinceVersion >= currentVersion) {
            // Already up to date
            return res.json({
                current_version: currentVersion,
                changes: []
            });
        }
        
        const changes = await Mezmur.getChangesSince(sinceVersion);
        
        // Format changes for the app
        const formattedChanges = changes.map(m => {
            const isDeleted = m.deleted_at !== null;
            if (isDeleted) {
                return {
                    id: m.id,
                    action: 'delete',
                    sync_version: m.sync_version
                };
            } else {
                return {
                    id: m.id,
                    action: 'upsert',
                    category_id: m.category_id,
                    title: m.title,
                    content: m.content,
                    language: m.language,
                    audio_url: m.audio_url,
                    sort_order: m.sort_order,
                    sync_version: m.sync_version
                };
            }
        });
        
        res.json({
            current_version: currentVersion,
            changes: formattedChanges
        });
    } catch (error) {
        console.error("Error syncing mezmurs:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// ==========================================
// ADMIN ENDPOINTS
// ==========================================

// GET /api/mezmur
exports.getAdminMezmurs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const search = req.query.search || '';
        const categoryId = req.query.categoryId || null;
        
        const result = await Mezmur.findAllAdmin(page, limit, search, categoryId);
        res.json(result);
    } catch (error) {
        console.error("Error fetching admin mezmurs:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /api/mezmur
exports.createMezmur = async (req, res) => {
    try {
        const data = req.body;
        if (!data.category_id || !data.content) {
            return res.status(400).json({ message: "Category ID and Content are required" });
        }
        
        const result = await Mezmur.create(data);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating mezmur:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// PUT /api/mezmur/:id
exports.updateMezmur = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        
        if (!data.category_id || !data.content) {
            return res.status(400).json({ message: "Category ID and Content are required" });
        }
        
        const result = await Mezmur.update(id, data);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mezmur not found" });
        }
        
        res.json(result);
    } catch (error) {
        console.error("Error updating mezmur:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// DELETE /api/mezmur/:id
exports.deleteMezmur = async (req, res) => {
    try {
        const id = req.params.id;
        
        const result = await Mezmur.softDelete(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Mezmur not found" });
        }
        
        res.json({ message: "Mezmur deleted", ...result });
    } catch (error) {
        console.error("Error deleting mezmur:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /api/mezmur/:id/audio
exports.uploadAudio = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No audio file provided" });
        }
        
        const id = req.params.id;
        const audioUrl = `/uploads/mezmur_audio/${req.file.filename}`;
        
        // Check if mezmur exists
        const mezmur = await Mezmur.findById(id);
        if (!mezmur) {
            // Delete uploaded file if mezmur doesn't exist
            fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: "Mezmur not found" });
        }
        
        // Remove old audio if it exists
        if (mezmur.audio_url) {
            const oldPath = path.join(__dirname, '..', mezmur.audio_url);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
            // Also attempt to remove old .opus and .m4a if they exist
            const oldOpus = oldPath.replace(path.extname(oldPath), '.opus');
            const oldM4a = oldPath.replace(path.extname(oldPath), '.m4a');
            if (fs.existsSync(oldOpus)) fs.unlinkSync(oldOpus);
            if (fs.existsSync(oldM4a)) fs.unlinkSync(oldM4a);
        }
        
        // Convert audio to .opus and .m4a
        try {
            await convertAudio(req.file.path, { exactBaseName: true });
        } catch (convErr) {
            console.error("Audio conversion failed:", convErr);
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: "Failed to process audio file formats." });
        }
        
        const result = await Mezmur.updateAudioUrl(id, audioUrl);
        res.json({ message: "Audio uploaded", audio_url: audioUrl, ...result });
    } catch (error) {
        console.error("Error uploading audio:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /api/mezmur/upload-audio
exports.uploadAudioTemp = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No audio file provided" });
        }
        
        const audioUrl = `/uploads/mezmur_audio/${req.file.filename}`;
        
        // Convert audio to .opus and .m4a
        try {
            await convertAudio(req.file.path, { exactBaseName: true });
        } catch (convErr) {
            console.error("Temp audio conversion failed:", convErr);
            fs.unlinkSync(req.file.path);
            return res.status(500).json({ message: "Failed to process audio file formats." });
        }
        
        res.json({ message: "Audio uploaded temporarily", audio_url: audioUrl });
    } catch (error) {
        console.error("Error uploading temp audio:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /api/mezmur/category
exports.createCategory = async (req, res) => {
    try {
        const data = req.body;
        if (!data.id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        
        const result = await MezmurCategory.create(data);
        res.status(201).json(result);
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// PUT /api/mezmur/category/:id
exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        
        const result = await MezmurCategory.update(id, data);
        if (result === 0) {
            return res.status(404).json({ message: "Category not found" });
        }
        
        res.json({ message: "Category updated" });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// GET /api/mezmur/duplicates/preview
// Returns groups of duplicate Mezmurs without modifying the database
exports.previewDuplicates = async (req, res) => {
    try {
        const groups = await Mezmur.findDuplicateGroups();
        res.json({ ok: true, groupCount: groups.length, groups });
    } catch (error) {
        console.error("Error previewing duplicates:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// POST /api/mezmur/duplicates/reject
// Soft-deletes all duplicate Mezmurs (keeps the one with audio, or the first one found)
exports.rejectDuplicates = async (req, res) => {
    try {
        const groups = await Mezmur.findDuplicateGroups();
        if (groups.length === 0) {
            return res.json({ ok: true, message: "No duplicates found", rejectedCount: 0 });
        }

        const pool = require('../config/db');
        let rejectedIds = [];

        for (const group of groups) {
            for (const dup of group.duplicates) {
                const connection = await pool.getConnection();
                try {
                    // Bump sync version so mobile apps get the delete signal
                    await connection.query(
                        "UPDATE mezmur_sync_counter SET current_version = current_version + 1 WHERE id = 1"
                    );
                    const [vRows] = await connection.query(
                        "SELECT current_version FROM mezmur_sync_counter WHERE id = 1"
                    );
                    const newVersion = vRows[0].current_version;

                    await connection.query(
                        "UPDATE mezmurs SET deleted_at = CURRENT_TIMESTAMP, sync_version = ? WHERE id = ? AND deleted_at IS NULL",
                        [newVersion, dup.id]
                    );
                    rejectedIds.push(dup.id);
                } finally {
                    connection.release();
                }
            }
        }

        res.json({
            ok: true,
            message: `${rejectedIds.length} duplicate Mezmur(s) have been soft-deleted.`,
            rejectedCount: rejectedIds.length,
            rejectedIds
        });
    } catch (error) {
        console.error("Error rejecting duplicates:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
