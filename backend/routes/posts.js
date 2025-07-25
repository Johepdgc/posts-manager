// Posts Routes - handles all post-related API endpoints
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // JWT authentication middleware
const Post = require('../models/Post');

/**
 * GET /posts
 * Retrieve all posts from the database
 * 
 * This is a public endpoint (no authentication required)
 * Returns all posts with author information, ordered by creation date
 */
router.get('/', async (req, res) => {
    try {
        // Fetch all posts from database (includes author names)
        const posts = await Post.findAll();
        res.json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /posts/:id
 * Retrieve a specific post by its ID
 * 
 * This is a public endpoint (no authentication required)
 * 
 * @param {number} id - Post ID from URL parameter
 * Returns specific post with author information or 404 if not found
 */
router.get('/:id', async (req, res) => {
    try {
        const postId = req.params.id;

        // Validate that ID is a number
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        // Find post by ID
        const post = await Post.findById(postId);

        // Check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /posts
 * Create a new post
 * 
 * This is a protected endpoint (requires JWT authentication)
 * Uses auth middleware to verify token and get user information
 * 
 * Expected body:
 * {
 *   "title": "string",
 *   "content": "string"
 * }
 * 
 * Returns: Created post object
 */
router.post('/', auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        // Basic validation - ensure required fields are provided
        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        // Validate title and content length
        if (title.trim().length === 0) {
            return res.status(400).json({ error: 'Title cannot be empty' });
        }

        if (content.trim().length === 0) {
            return res.status(400).json({ error: 'Content cannot be empty' });
        }

        // Create new post with authenticated user as author
        // req.user is set by the auth middleware
        const newPost = await Post.create({
            title: title.trim(),
            content: content.trim(),
            author_id: req.user.id
        });

        // Return the created post
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router to be used in main application
module.exports = router;
