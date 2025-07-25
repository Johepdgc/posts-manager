// JWT Authentication Middleware
// This middleware protects routes by verifying JWT tokens
const jwt = require('jsonwebtoken');

/**
 * Authentication middleware function
 * Verifies JWT token from Authorization header and adds user info to request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object  
 * @param {Function} next - Express next middleware function
 * 
 * Expected header format: "Authorization: Bearer <jwt_token>"
 */
module.exports = (req, res, next) => {
    // Get the Authorization header from the request
    const header = req.headers.authorization;

    // Check if Authorization header exists
    if (!header) {
        return res.status(401).json({ error: 'Missing token' });
    }

    // Extract the token by removing 'Bearer ' prefix
    const token = header.replace('Bearer ', '');

    try {
        // Verify the token using the JWT secret from environment variables
        // If valid, this will decode the token payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Add the decoded user information to the request object
        // This makes user data available in subsequent route handlers
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        // Token verification failed (invalid, expired, or malformed)
        // Log the error for debugging purposes
        console.error('JWT verification failed:', error.message);
        res.status(401).json({ error: 'Invalid token' });
    }
};
