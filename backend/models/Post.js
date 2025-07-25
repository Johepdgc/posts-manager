// Post model - handles all post-related database operations
const db = require('../src/db');

/**
 * Post model with methods for post management
 * Handles post creation, retrieval, and database operations
 */
module.exports = {
    /**
     * Create a new post in the database
     * @param {Object} postData - Post data object
     * @param {string} postData.title - Post title
     * @param {string} postData.content - Post content/body
     * @param {number} postData.author_id - ID of the user creating the post
     * @returns {Object} Created post object with all fields including timestamps
     */
    async create({ title, content, author_id }) {
        const res = await db.query(
            `INSERT INTO posts(title, content, author_id)
             VALUES($1, $2, $3) RETURNING *`,
            [title, content, author_id]
        );
        return res.rows[0];
    },

    /**
     * Retrieve all posts from the database
     * @returns {Array} Array of all posts ordered by creation date (newest first)
     */
    async findAll() {
        const res = await db.query(
            `SELECT posts.*, users.username as author_name 
             FROM posts 
             JOIN users ON posts.author_id = users.id 
             ORDER BY posts.created_at DESC`
        );
        return res.rows;
    },

    /**
     * Find a specific post by its ID
     * @param {number} id - Post ID to search for
     * @returns {Object|undefined} Post object with author information or undefined if not found
     */
    async findById(id) {
        const res = await db.query(
            `SELECT posts.*, users.username as author_name 
             FROM posts 
             JOIN users ON posts.author_id = users.id 
             WHERE posts.id = $1`,
            [id]
        );
        return res.rows[0]; // Returns undefined if no post found
    }
};
