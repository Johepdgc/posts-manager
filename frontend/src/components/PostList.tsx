"use client";

import React from "react";
import { Post } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCalendar,
  faExclamationTriangle,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";

interface PostCardProps {
  post: Post;
  onPostClick?: (post: Post) => void;
}

// Extracted post content component to avoid duplication
const PostContent: React.FC<{ post: Post }> = ({ post }) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <>
      {/* Post Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
          {post.title}
        </h3>
        <div className="flex-shrink-0 ml-4">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            #{post.id}
          </span>
        </div>
      </div>

      {/* Post Content Preview */}
      <div className="mb-4">
        <p className="text-gray-600 line-clamp-3 leading-relaxed">
          {post.content}
        </p>
      </div>

      {/* Post Footer */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center">
            <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-1" />
            By {post.author_name || `User ${post.author_id}`}
          </span>
        </div>
        <div className="flex items-center">
          <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 mr-1" />
          {formatDate(post.created_at)}
        </div>
      </div>

      {/* Read More Indicator */}
      {post.content.length > 150 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-blue-600 text-sm font-medium">Read more →</span>
        </div>
      )}
    </>
  );
};

export const PostCard: React.FC<PostCardProps> = ({ post, onPostClick }) => {
  const handleClick = () => {
    onPostClick?.(post);
  };

  return (
    <>
      {onPostClick ? (
        <button
          className="w-full text-left bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
          onClick={handleClick}
          aria-label={`Read full post: ${post.title}`}
        >
          <PostContent post={post} />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <PostContent post={post} />
        </div>
      )}
    </>
  );
};

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  error?: string | null;
  onPostClick?: (post: Post) => void;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  loading = false,
  error = null,
  onPostClick,
}) => {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="h-6 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-12"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="w-12 h-12 mx-auto mb-4"
          />
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error Loading Posts
        </h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-400 mb-4">
          <FontAwesomeIcon icon={faFileAlt} className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
        <p className="text-gray-600">Be the first to create a post!</p>
      </div>
    );
  }

  // Posts list
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onPostClick={onPostClick} />
      ))}
    </div>
  );
};
