// User model - handles all user-related database operations
const db = require('../src/db');
const bcrypt = require('bcryptjs');

/**
 * User model with methods for user management
 * Handles user creation, authentication, and data retrieval
 */
module.exports = {
    /**
     * Create a new user in the database
     * @param {Object} userData - User data object
     * @param {string} userData.username - User's chosen username
     * @param {string} userData.email - User's email address
     * @param {string} userData.password - User's plain text password (will be hashed)
     * @returns {Object} Created user object (without password)
     */
    async create({ username, email, password }) {
        // Hash the password with bcrypt (10 salt rounds for security)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database and return user data (excluding password)
        const res = await db.query(
            `INSERT INTO users(username, email, password)
             VALUES($1, $2, $3) RETURNING id, username, email, created_at`,
            [username, email, hashedPassword]
        );

        return res.rows[0];
    },

    /**
     * Find a user by their email address
     * @param {string} email - User's email address
     * @returns {Object|undefined} User object (including password hash) or undefined if not found
     */
    async findByEmail(email) {
        const res = await db.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        return res.rows[0]; // Returns undefined if no user found
    },

    /**
     * Find a user by their ID
     * @param {number} id - User's unique ID
     * @returns {Object|undefined} User object (without password) or undefined if not found
     */
    async findById(id) {
        const res = await db.query(
            `SELECT id, username, email, created_at FROM users WHERE id = $1`,
            [id]
        );

        return res.rows[0]; // Returns undefined if no user found
    },

    /**
     * Validate a user's password against the stored hash
     * @param {string} plainPassword - Plain text password to validate
     * @param {string} hashedPassword - Stored password hash from database
     * @returns {boolean} True if password is valid, false otherwise
     */
    async validatePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
};