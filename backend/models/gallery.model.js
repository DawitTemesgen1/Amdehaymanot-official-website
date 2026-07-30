const pool = require("../config/db.js");
const Gallery = {};

// --- CATEGORY LOGIC ---
Gallery.createCategory = async (data) => {
    const [result] = await pool.query("INSERT INTO gallery_categories SET ?", data);
    return { id: result.insertId, ...data };
};
Gallery.findAllCategories = async () => {
    const [rows] = await pool.query("SELECT * FROM gallery_categories ORDER BY name ASC");
    return rows;
};
Gallery.deleteCategory = async (id) => {
    const [result] = await pool.query("DELETE FROM gallery_categories WHERE id = ?", [id]);
    return result.affectedRows;
};

// --- ALBUM LOGIC ---
Gallery.createAlbum = async (data) => {
    const [result] = await pool.query("INSERT INTO albums SET ?", data);
    return { id: result.insertId, ...data };
};
Gallery.findAllAlbums = async () => {
    const query = `
        SELECT a.*, c.name as categoryName, (SELECT COUNT(*) FROM album_images WHERE albumId = a.id) as imageCount
        FROM albums a 
        LEFT JOIN gallery_categories c ON a.categoryId = c.id 
        ORDER BY a.createdAt DESC`;
    const [rows] = await pool.query(query);
    return rows;
};
Gallery.findAlbumById = async (id) => {
    const [albumRows] = await pool.query("SELECT a.*, c.name as categoryName FROM albums a LEFT JOIN gallery_categories c ON a.categoryId = c.id WHERE a.id = ?", [id]);
    if (!albumRows.length) return null;

    const [imageRows] = await pool.query("SELECT * FROM album_images WHERE albumId = ? ORDER BY createdAt DESC", [id]);
    
    albumRows[0].images = imageRows;
    return albumRows[0];
};
Gallery.updateAlbum = async (id, data) => {
    const [result] = await pool.query("UPDATE albums SET ? WHERE id = ?", [data, id]);
    return result.affectedRows;
};
Gallery.deleteAlbum = async (id) => {
    const [result] = await pool.query("DELETE FROM albums WHERE id = ?", [id]);
    return result.affectedRows;
};
Gallery.findAlbumImages = async (id) => {
    const [rows] = await pool.query("SELECT image_url FROM album_images WHERE albumId = ?", [id]);
    return rows;
};

// --- IMAGE LOGIC ---
Gallery.addImagesToAlbum = async (images) => {
    // images is an array of arrays: [[albumId, title, url, thumbUrl], ...]
    const [result] = await pool.query("INSERT INTO album_images (albumId, title, image_url, thumbnail_url) VALUES ?", [images]);
    return result.affectedRows;
};
Gallery.findImageById = async (id) => {
    const [rows] = await pool.query("SELECT * FROM album_images WHERE id = ?", [id]);
    return rows[0];
};
Gallery.deleteImage = async (id) => {
    const [result] = await pool.query("DELETE FROM album_images WHERE id = ?", [id]);
    return result.affectedRows;
};
Gallery.likeImage = async (id) => {
    await pool.query("UPDATE album_images SET likes = likes + 1 WHERE id = ?", [id]);
};

module.exports = Gallery;