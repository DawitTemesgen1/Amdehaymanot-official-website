const pool = require('../config/db');

const Mezmur = {};

// Internal helper to bump sync version
const _incrementSyncVersion = async (connection) => {
    const [result] = await connection.query(
        "UPDATE mezmur_sync_counter SET current_version = current_version + 1 WHERE id = 1"
    );
    const [rows] = await connection.query(
        "SELECT current_version FROM mezmur_sync_counter WHERE id = 1"
    );
    return rows[0].current_version;
};

Mezmur.getCurrentSyncVersion = async () => {
    const [rows] = await pool.query("SELECT current_version FROM mezmur_sync_counter WHERE id = 1");
    return rows[0] ? rows[0].current_version : 0;
};

Mezmur.findAllAdmin = async (page = 1, limit = 50, search = '', categoryId = null) => {
    const offset = (page - 1) * limit;
    let query = "SELECT m.*, c.title_am as category_title FROM mezmurs m LEFT JOIN mezmur_categories c ON m.category_id = c.id";
    const queryParams = [];
    
    let whereClauses = [];
    if (search) {
        whereClauses.push("(m.title LIKE ? OR m.content LIKE ?)");
        queryParams.push(`%${search}%`, `%${search}%`);
    }
    if (categoryId) {
        whereClauses.push("m.category_id = ?");
        queryParams.push(categoryId);
    }
    // We can show soft-deleted mezmurs in admin with a specific flag, but for now we'll just show them all
    
    if (whereClauses.length > 0) {
        query += " WHERE " + whereClauses.join(" AND ");
    }
    
    query += " ORDER BY m.id DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, offset);
    
    const [rows] = await pool.query(query, queryParams);
    
    // Get total count
    let countQuery = "SELECT COUNT(*) as total FROM mezmurs m";
    if (whereClauses.length > 0) {
        countQuery += " WHERE " + whereClauses.join(" AND ");
    }
    const [countRows] = await pool.query(countQuery, queryParams.slice(0, -2));
    
    return {
        data: rows,
        total: countRows[0].total,
        page,
        totalPages: Math.ceil(countRows[0].total / limit)
    };
};

Mezmur.getChangesSince = async (version) => {
    // Only return rows that have sync_version > the requested version
    const [rows] = await pool.query(
        "SELECT id, category_id, title, content, language, audio_url, sort_order, sync_version, deleted_at FROM mezmurs WHERE sync_version > ?",
        [version]
    );
    return rows;
};

Mezmur.findById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM mezmurs WHERE id = ?", [id]);
    return rows[0];
};

Mezmur.create = async (data) => {
    const { category_id, title, content, language, audio_url, sort_order } = data;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const newVersion = await _incrementSyncVersion(connection);
        
        const [result] = await connection.query(
            "INSERT INTO mezmurs (category_id, title, content, language, audio_url, sort_order, sync_version) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [category_id, title || null, content, language || 'am', audio_url || null, sort_order || 0, newVersion]
        );
        
        await connection.commit();
        return { id: result.insertId, sync_version: newVersion };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

Mezmur.update = async (id, data) => {
    const { category_id, title, content, language, audio_url, sort_order } = data;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const newVersion = await _incrementSyncVersion(connection);
        
        const [result] = await connection.query(
            "UPDATE mezmurs SET category_id = ?, title = ?, content = ?, language = ?, audio_url = ?, sort_order = ?, sync_version = ?, deleted_at = NULL WHERE id = ?",
            [category_id, title || null, content, language || 'am', audio_url || null, sort_order || 0, newVersion, id]
        );
        
        await connection.commit();
        return { affectedRows: result.affectedRows, sync_version: newVersion };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

Mezmur.softDelete = async (id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const newVersion = await _incrementSyncVersion(connection);
        
        const [result] = await connection.query(
            "UPDATE mezmurs SET deleted_at = CURRENT_TIMESTAMP, sync_version = ? WHERE id = ?",
            [newVersion, id]
        );
        
        await connection.commit();
        return { affectedRows: result.affectedRows, sync_version: newVersion };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

Mezmur.updateAudioUrl = async (id, audioUrl) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const newVersion = await _incrementSyncVersion(connection);
        
        const [result] = await connection.query(
            "UPDATE mezmurs SET audio_url = ?, sync_version = ? WHERE id = ?",
            [audioUrl, newVersion, id]
        );
        
        await connection.commit();
        return { affectedRows: result.affectedRows, sync_version: newVersion };
    } catch (err) {
        await connection.rollback();
        throw err;
    } finally {
        connection.release();
    }
};

Mezmur.findPotentialDuplicate = async (title, lyricsSnippet) => {
    // Basic search on title or a snippet of the lyrics to find duplicates
    const [rows] = await pool.query(
        "SELECT id, title FROM mezmurs WHERE title LIKE ? OR content LIKE ? LIMIT 1",
        [`%${title}%`, `%${lyricsSnippet}%`]
    );
    return rows[0] || null;
};

Mezmur.searchForBot = async (query) => {
    const [rows] = await pool.query(
        "SELECT id, title, content FROM mezmurs WHERE title LIKE ? OR content LIKE ? ORDER BY id DESC LIMIT 5",
        [`%${query}%`, `%${query}%`]
    );
    return rows;
};

/**
 * Find groups of duplicate Mezmurs by comparing the first 200 chars of lyrics.
 * Returns groups: each group has a 'keep' item (preferring one with audio_url)
 * and a 'duplicates' array of IDs to soft-delete.
 */
Mezmur.findDuplicateGroups = async () => {
    const [rows] = await pool.query(
        `SELECT id, title, SUBSTRING(content, 1, 200) as content_snippet, audio_url
         FROM mezmurs
         WHERE deleted_at IS NULL
         ORDER BY
           CASE WHEN audio_url IS NOT NULL AND audio_url != '' THEN 0 ELSE 1 END ASC,
           id ASC`
    );

    const groups = [];
    const processed = new Set();

    for (let i = 0; i < rows.length; i++) {
        if (processed.has(rows[i].id)) continue;
        const base = rows[i];
        const baseSnippet = (base.content_snippet || '').trim().substring(0, 100).toLowerCase();
        if (!baseSnippet) continue;

        const group = { keep: base, duplicates: [] };

        for (let j = i + 1; j < rows.length; j++) {
            if (processed.has(rows[j].id)) continue;
            const candidate = rows[j];
            const candidateSnippet = (candidate.content_snippet || '').trim().substring(0, 100).toLowerCase();

            // Simple similarity: compare first 80 chars after stripping spaces/punctuation
            const normalize = (s) => s.replace(/[\s\u1361\u1363\u1364\u00bb\u00ab,.()\[\]!?]/g, '');
            const baseNorm = normalize(baseSnippet).substring(0, 80);
            const candidateNorm = normalize(candidateSnippet).substring(0, 80);

            if (baseNorm.length > 20 && candidateNorm.startsWith(baseNorm.substring(0, 40))) {
                group.duplicates.push(candidate);
                processed.add(candidate.id);
            }
        }

        if (group.duplicates.length > 0) {
            processed.add(base.id);
            groups.push(group);
        }
    }

    return groups;
};

module.exports = Mezmur;
