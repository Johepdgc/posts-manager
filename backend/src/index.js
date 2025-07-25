// Load environment variables from .env file
require('dotenv').config();

// Import required packages
const express = require('express');
const cors = require('cors');

// Import route handlers
const authRoutes = require('../routes/auth');
const postRoutes = require('../routes/posts');

// Create Express application instance
const app = express();

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing for all routes
app.use(express.json()); // Parse JSON request bodies

// Route setup
// All authentication-related routes (register, login) will be prefixed with /auth
app.use('/auth', authRoutes);

// All post-related routes will be prefixed with /posts
app.use('/posts', postRoutes);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Posts Manager API running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`📚 Available endpoints:`);
    console.log(`   POST /auth/register - Register new user`);
    console.log(`   POST /auth/login    - Login user`);
    console.log(`   GET  /posts         - Get all posts`);
    console.log(`   GET  /posts/:id     - Get specific post`);
    console.log(`   POST /posts         - Create new post (requires auth)`);
});
