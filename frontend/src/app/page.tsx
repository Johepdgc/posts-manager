"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { postsAPI, Post } from "@/lib/api";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";
import { PostList } from "@/components/PostList";
import { CreatePostForm } from "@/components/CreatePostForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSync, faUser } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  // Fetch posts using React Query - only when authenticated
  const {
    data: posts = [],
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: postsAPI.getAllPosts,
    // Only fetch when user is authenticated
    enabled: isAuthenticated,
    // Refetch every 30 seconds to get new posts
    refetchInterval: isAuthenticated ? 30000 : false,
  });

  // Handle post click to show details
  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  // Handle successful post creation
  const handlePostCreated = () => {
    setShowCreatePost(false);
    refetchPosts();
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onShowCreatePost={() => setShowCreatePost(true)}
        showCreateButton={isAuthenticated && !showCreatePost}
      />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated && (
          /* Not Authenticated - Show Login or Register */
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome to Posts Manager
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {showRegister
                  ? "Create your account to start sharing posts"
                  : "Please sign in to view and manage posts"}
              </p>
            </div>

            {showRegister ? (
              <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
            ) : (
              <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
            )}
          </div>
        )}

        {isAuthenticated && showCreatePost && (
          /* Authenticated - Show Create Post Form */
          <div className="space-y-6">
            <CreatePostForm
              onSuccess={handlePostCreated}
              onCancel={() => setShowCreatePost(false)}
            />
          </div>
        )}

        {isAuthenticated && !showCreatePost && selectedPost && (
          /* Show Selected Post Details */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="w-4 h-4 mr-2" />
                Back to Posts
              </button>
            </div>

            <article className="bg-white shadow-lg rounded-lg p-8 border border-gray-200">
              <header className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {selectedPost.title}
                </h1>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="inline-flex items-center">
                    <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-1" />
                    By{" "}
                    {selectedPost.author_name ||
                      `User ${selectedPost.author_id}`}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    {new Date(selectedPost.created_at).toLocaleDateString()}
                  </span>
                </div>
              </header>

              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
            </article>
          </div>
        )}

        {isAuthenticated && !showCreatePost && !selectedPost && (
          /* Authenticated - Show Posts List */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
              <div className="text-sm text-gray-500">
                {posts.length} {posts.length === 1 ? "post" : "posts"} total
              </div>
            </div>

            <PostList
              posts={posts}
              loading={postsLoading}
              error={postsError?.message || null}
              onPostClick={handlePostClick}
            />

            {/* Refresh Button */}
            <div className="text-center pt-6">
              <button
                onClick={() => refetchPosts()}
                disabled={postsLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faSync} className="w-4 h-4 mr-2" />
                {postsLoading ? "Refreshing..." : "Refresh Posts"}
              </button>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Built with ❤️ by Johep Gradis</p>
            <p className="mt-1">
              Posts Manager Test {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
