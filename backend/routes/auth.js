// Authentication Routes - handles user registration and login
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

/**
 * POST /auth/register
 * Register a new user account
 */
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Basic validation - ensure all required fields are provided
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists with this email
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create new user (password will be hashed in the User model)
        const newUser = await User.create({ username, email, password });

        // Generate JWT token for the new user
        // Token contains user ID and email, expires in 24 hours
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token and user info (no password)
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /auth/login  
 * Authenticate user and return JWT token
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Basic validation - ensure email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user by email (this will include the password hash)
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Validate password against stored hash
        const isValidPassword = await User.validatePassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token for authenticated user
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return success response with token and user info (no password)
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Export the router to be used in main application
module.exports = router;
