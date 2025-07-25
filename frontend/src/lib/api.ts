// API configuration and utilities for the Posts Manager frontend
import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we get a 401, remove the token and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      // You could also redirect to login page here
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Type definitions
export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  author_name?: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface CreatePostData {
  title: string;
  content: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

// Auth API functions
export const authAPI = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

// Posts API functions
export const postsAPI = {
  // Get all posts
  getAllPosts: async (): Promise<Post[]> => {
    const response = await api.get("/posts");
    return response.data;
  },

  // Get specific post by ID
  getPost: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  // Create new post (requires authentication)
  createPost: async (postData: CreatePostData): Promise<Post> => {
    const response = await api.post("/posts", postData);
    return response.data;
  },
};

// Auth utility functions
export const authUtils = {
  // Save auth data to localStorage
  saveAuthData: (token: string, user: User) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Get auth data from localStorage
  getAuthData: () => {
    const token = localStorage.getItem("auth_token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  },

  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("auth_token");
    return !!token;
  },
};

export default api;
