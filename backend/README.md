# Posts Manager Backend

A simple REST API for managing posts with JWT authentication built with Node.js, Express.js, and PostgreSQL.

### File Descriptions

#### Core Application Files

- **`src/index.js`**: Main Express server that configures middleware, routes, and starts the application
- **`src/db.js`**: PostgreSQL connection pool configuration using the `pg` library
- **`src/setup-db.js`**: Database initialization script that creates tables and inserts seed data

#### Models (Data Layer)

- **`models/User.js`**: Handles all user-related database operations (create, find, password validation)
- **`models/Post.js`**: Handles all post-related database operations (create, find all, find by ID)

#### Routes (API Layer)

- **`routes/auth.js`**: Authentication endpoints for user registration and login
- **`routes/posts.js`**: Post management endpoints (create, read operations)

#### Middleware

- **`middleware/auth.js`**: JWT token verification middleware for protecting routes

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### Posts

- `GET /posts` - Get all posts (public)
- `GET /posts/:id` - Get specific post (public)
- `POST /posts` - Create a new post (requires authentication)

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database server
- npm package manager

### Installation Steps

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Setup environment variables:**

   Create a `.env` file in the backend directory with the following variables:

   ```env
   # Database Configuration (Choose one format)
   # Option 1: Connection URL
   DATABASE_URL=postgres://username:password@localhost:5432/posts_manager

   # Option 2: Individual parameters (alternative)
   # DB_HOST=localhost
   # DB_PORT=5432
   # DB_NAME=posts_manager
   # DB_USER=username
   # DB_PASSWORD=password

   # JWT and Server Configuration
   JWT_SECRET=your_secure_jwt_secret_here
   PORT=4000
   ```

   Replace:

   - `username` and `password` with your PostgreSQL credentials
   - `your_secure_jwt_secret_here` with a secure random string

3. **Create the database:**

   ```bash
   createdb posts_manager
   ```

4. **Setup database tables and seed data:**

   ```bash
   npm run setup-db
   ```

   This will create the required tables and insert sample data including a test user.

5. **Start the server:**

   ```bash
   # Development mode (with nodemon for auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

   The server will start on the port specified in your `.env` file.

6. **Setup database:**

   ```bash
   npm run setup-db
   ```

7. **Start the server:**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Posts Table

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Sample User

After running `npm run setup-db`, you can use these credentials:

- **Email:** admin@example.com
- **Password:** password123

## Testing the API

### Using Postman

#### 1. Setup Postman Collection

1. Open Postman and create a new collection called "Posts Manager API"
2. Set up an environment with these variables:
   - `base_url`: `http://localhost:4000`
   - `auth_token`: (leave empty, will be set automatically)

#### 2. Test Requests (in order)

**Health Check - Get All Posts**

- Method: `GET`
- URL: `{{base_url}}/posts`
- Expected: List of existing posts

**User Login**

- Method: `POST`
- URL: `{{base_url}}/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- Tests script (to save token):
  ```javascript
  if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.token);
  }
  ```

**Create New Post (Protected)**

- Method: `POST`
- URL: `{{base_url}}/posts`
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer {{auth_token}}`
- Body (raw JSON):
  ```json
  {
    "title": "My Test Post",
    "content": "This is a test post created via Postman"
  }
  ```

**Get Specific Post**

- Method: `GET`
- URL: `{{base_url}}/posts/1`
- Expected: Details of post with ID 1

**User Registration**

- Method: `POST`
- URL: `{{base_url}}/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
  ```json
  {
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "newpassword123"
  }
  ```

#### 3. Error Testing

Test these scenarios to verify proper error handling:

- **Invalid Login**: Wrong email/password → 401 Unauthorized
- **Missing Token**: POST to `/posts` without Authorization header → 401 "Missing token"
- **Invalid Token**: POST to `/posts` with wrong token → 401 "Invalid token"
- **Duplicate Registration**: Register with existing email → 400 "User already exists"

### Using cURL

**Register a new user:**

```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Login:**

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'
```

**Create a post:**

```bash
curl -X POST http://localhost:4000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My New Post",
    "content": "This is the content of my post."
  }'
```

**Get all posts:**

```bash
curl http://localhost:4000/posts
```

**Get specific post:**

```bash
curl http://localhost:4000/posts/1
```

## Expected API Responses

### Successful Login (200)

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### Successful Post Creation (201)

```json
{
  "id": 3,
  "title": "My New Post",
  "content": "This is the content of my post.",
  "author_id": 1,
  "created_at": "2025-07-24T23:00:00.000Z"
}
```

### Development Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run setup-db` - Initialize database with tables and seed data
