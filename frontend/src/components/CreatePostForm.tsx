"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postsAPI, CreatePostData } from "@/lib/api";

interface CreatePostFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreatePostForm: React.FC<CreatePostFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  // Create post mutation using React Query
  const createPostMutation = useMutation({
    mutationFn: (postData: CreatePostData) => postsAPI.createPost(postData),
    onSuccess: () => {
      // Invalidate and refetch posts to show the new post
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      // Clear form
      setTitle("");
      setContent("");
      // Call success callback if provided
      onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to create post:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      createPostMutation.mutate({
        title: title.trim(),
        content: content.trim(),
      });
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    onCancel?.();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
          <p className="text-gray-600 mt-2">
            Share your thoughts with the community
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Input */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={255}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter a compelling title for your post..."
              disabled={createPostMutation.isPending}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {title.length}/255 characters
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Post Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              placeholder="Write your post content here... Share your ideas, experiences, or thoughts!"
              disabled={createPostMutation.isPending}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {content.length} characters
            </div>
          </div>

          {/* Error Message */}
          {createPostMutation.isError && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">
                {createPostMutation.error instanceof Error
                  ? createPostMutation.error.message
                  : "Failed to create post. Please try again."}
              </p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={createPostMutation.isPending}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={
                createPostMutation.isPending || !title.trim() || !content.trim()
              }
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createPostMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Post...
                </div>
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </form>

        {/* Success Message */}
        {createPostMutation.isSuccess && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">
              ✅ Post created successfully!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
