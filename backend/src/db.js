// Database connection configuration using PostgreSQL
const { Pool } = require('pg');

// Create a connection pool to PostgreSQL database
// Using connection string from environment variable for security
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Optional: Add connection pool settings for production
    // max: 20, // Maximum number of clients in the pool
    // idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    // connectionTimeoutMillis: 2000, // How long to wait when connecting a new client
});

// Export a query function that uses the connection pool
// This function can be used throughout the application to execute SQL queries
module.exports = {
    query: (text, params) => pool.query(text, params),
    // Optional: Export the pool for advanced use cases
    pool: pool
};
