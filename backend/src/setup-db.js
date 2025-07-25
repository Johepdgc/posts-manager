// Database setup script - creates tables and inserts seed data
// Load environment variables
require('dotenv').config();

// Import database connection and bcrypt for password hashing
const db = require('./db');
const bcrypt = require('bcryptjs');

/**
 * Main function to set up the database
 * Creates tables if they don't exist and inserts seed data
 */
async function setupDatabase() {
    try {
        console.log('🔧 Setting up database tables...');

        // Create users table with proper constraints
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create posts table with foreign key relationship to users
        await db.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                content TEXT NOT NULL,
                author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Tables created successfully!');

        // Create seed user for testing purposes
        // Hash the password for security (10 rounds of salt)
        const hashedPassword = await bcrypt.hash('password123', 10);

        // Check if seed user already exists to avoid duplicates
        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', ['admin@example.com']);

        if (existingUser.rows.length === 0) {
            console.log('🌱 Creating seed data...');

            // Insert seed user
            const userResult = await db.query(`
                INSERT INTO users (username, email, password)
                VALUES ($1, $2, $3) RETURNING id
            `, ['admin', 'admin@example.com', hashedPassword]);

            const userId = userResult.rows[0].id;

            // Insert sample posts for the seed user
            await db.query(`
                INSERT INTO posts (title, content, author_id)
                VALUES 
                    ($1, $2, $3),
                    ($4, $5, $6)
            `, [
                'Welcome to Posts Manager',
                'This is your first post! You can create, read, and manage posts here.',
                userId,
                'Getting Started',
                'To get started, you can use the API endpoints to create new posts or fetch existing ones.',
                userId
            ]);

            console.log('✅ Seed data created successfully!');
            console.log('👤 Sample user credentials:');
            console.log('   📧 Email: admin@example.com');
            console.log('   🔒 Password: password123');
        } else {
            console.log('ℹ️  Seed user already exists, skipping seed data creation.');
        }

    } catch (error) {
        console.error('❌ Error setting up database:', error);
        process.exit(1); // Exit with error code
    } finally {
        // Close the database connection and exit the process
        console.log('🏁 Database setup completed.');
        process.exit(0);
    }
}

// Execute the setup function
setupDatabase();
