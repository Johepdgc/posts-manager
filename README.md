# Posts Manager 📝

A modern full-stack application for managing and sharing posts. Built with React/Next.js frontend, Node.js/Express backend, and PostgreSQL database.

## ✨ Features

- 🔐 **User Authentication** - Register/Login with JWT tokens
- 📝 **Post Management** - Create, read, and manage posts
- 👤 **User Profiles** - Personal user accounts
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- 🔄 **Real-time Updates** - Live post refresh functionality
- 📱 **Mobile Friendly** - Responsive design for all devices

## 🛠️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS framework
- **React Query** - Server state management
- **Font Awesome** - Icon library
- **Axios** - HTTP client

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Johepdgc/posts-manager.git
cd posts-manager
```

### 2. One-Command Setup (Recommended)

```bash
npm run setup
```

This will:

- Install all dependencies for root, backend, and frontend
- Set up the PostgreSQL database with required tables
- Create initial database schema

### 3. Start the Application

```bash
npm run dev
```

This will start both frontend and backend simultaneously:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

## 📋 Manual Setup (Alternative)

If you prefer manual setup or encounter issues:

### Backend Setup

```bash
cd backend
npm install
npm run setup-db  # Sets up PostgreSQL database
npm run dev       # Start backend server
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev       # Start frontend development server
```

## 🗄️ Database Configuration

The application uses PostgreSQL. Create `backend/.env` with your database configuration:

```env
# Database Configuration (Choose one format)
# Option 1: Individual parameters
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posts_manager
DB_USER=postgres
DB_PASSWORD=your_password

# Option 2: Connection URL
# DATABASE_URL=postgres://username:password@localhost:5432/posts_manager

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=4000
```

### Database Schema

The application creates two main tables:

**Users Table:**

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Posts Table:**

```sql
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sample User

After running the setup, you can login with:

- **Email:** admin@example.com
- **Password:** password123

## 📖 Available Scripts

### Root Directory

- `npm run setup` - Complete setup (install + database)
- `npm run install-all` - Install dependencies for all projects
- `npm run dev` - Start both frontend and backend in development
- `npm run start` - Start both frontend and backend in production
- `npm run build` - Build frontend for production

### Backend (`/backend`)

- `npm run dev` - Start backend in development mode
- `npm start` - Start backend in production mode
- `npm run setup-db` - Initialize PostgreSQL database

### Frontend (`/frontend`)

- `npm run dev` - Start frontend development server
- `npm run build` - Build for production
- `npm start` - Start production server

## 🔧 Development

### Project Structure

```
posts-manager/
├── backend/                 # Node.js/Express API
│   ├── middleware/         # Authentication middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── src/               # Main server files
├── frontend/              # Next.js React app
│   ├── src/
│   │   ├── app/          # Next.js app directory
│   │   ├── components/   # React components
│   │   ├── contexts/     # React contexts
│   │   └── lib/          # Utilities and API client
└── package.json          # Root package.json with scripts
```

### Environment Variables

Create `.env` files in the backend directory:

**backend/.env:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=posts_manager
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-jwt-secret-key
PORT=4000
```

## 🎯 Usage

1. **Register/Login**: Create an account or sign in
2. **Create Posts**: Click "New Post" to create content
3. **View Posts**: Browse all posts on the main page
4. **Read Details**: Click any post to view full content
5. **Refresh**: Use the refresh button to get latest posts

## 🔒 Authentication

- **Registration**: Create new account with username, email, password
- **Login**: Sign in with email and password
- **JWT Tokens**: Secure authentication with 24-hour expiry
- **Protected Routes**: Posts require authentication to view/create

## 🛠️ API Endpoints

### Authentication

- `POST /auth/register` - Register a new user

  ```json
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /auth/login` - Login user
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```

### Posts

- `GET /posts` - Get all posts
- `GET /posts/:id` - Get specific post
- `POST /posts` - Create a new post
  ```json
  {
    "title": "My New Post",
    "content": "This is the content of my post."
  }
  ```

### Example API Response

**Successful Login (200):**

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

## 🧪 Quick API Testing

### Using cURL

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

> For detailed API testing with Postman, check the backend [README.md](./backend/README.md)

## 🚨 Troubleshooting

### Common Issues

**Database Connection Error:**

```bash
# Make sure PostgreSQL is running
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Check database exists
createdb posts_manager
```

**Port Already in Use:**

```bash
# Kill process on port 3000 or 4000
npx kill-port 3000
npx kill-port 4000
```

**Module Not Found:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm run install-all
```

## 👨‍💻 Author

**Johep Gradis**

- GitHub: [@Johepdgc](https://github.com/Johepdgc)

---

**🚀**
