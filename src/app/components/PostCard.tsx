"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { format } from "timeago.js";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Pencil,
  Trash,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { Post } from "@/app/types";

type PostCardProps = {
  post: Post;
  currentUserId: string;
  toggleLike: () => void;
  editPost: (id: string, newDescription: string) => void;
  deletePost: (id: string) => void;
  addComment?: (id: string, text: string) => void;
};

export default function PostCard({
  post,
  currentUserId,
  toggleLike,
  editPost,
  deletePost,
  addComment,
}: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    post.description || ""
  );
  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(5);
  const username = post.user?.username ?? "Unknown";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    username
  )}&background=random&size=64`;
  const isOwner = post.user?._id === currentUserId;

  const handleEditSave = () => {
    if (editedDescription.trim() !== post.description && editPost) {
      editPost(post._id, editedDescription);
    }
    setIsEditing(false);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !addComment) return;
    addComment(post._id, newComment);
    setNewComment("");
  };

  const toggleComments = () => {
    if (visibleComments >= post.comments.length) {
      setVisibleComments(5); // collapse back
    } else {
      setVisibleComments((prev) => prev + 5); // show next 5
    }
  };

  const showToggleButton = (post.comments?.length ?? 0) > 5;

  return (
    <Card className="mb-6 w-full max-w-xl mx-auto bg-card text-card-foreground flex flex-col gap-6 border py-6 rounded-none shadow-none">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex justify-between items-center">
            <Link href={`/${username}`}>
              <div className="text-sm font-semibold">{username}</div>
            </Link>
            <div className="text-xs text-gray-500">
              {format(post.createdAt)}
            </div>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Post Actions</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => deletePost(post._id)}
                  >
                    <Trash className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Image */}
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={`post-${post._id}`}
            width={400}
            height={400}
            className="w-full max-h-[720px] object-cover"
          />
        )}

        {/* Post Actions */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleLike}>
                <Heart
                  className={`w-6 h-6 ${
                    post.liked ? "text-red-500 fill-red-500" : ""
                  }`}
                />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <Bookmark className="w-5 h-5" />
            </Button>
          </div>

          {/* Likes count */}
          <div className="text-sm font-semibold mb-1">{post.likes} likes</div>

          {/* Description / Edit */}
          <div className="text-sm">
            <Link href={`/${username}`}>
              <span className="font-semibold mr-1">{username}</span>
            </Link>
            {isEditing ? (
              <div className="flex gap-2 mt-1">
                <Input
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="text-sm"
                />
                <Button variant="outline" size="sm" onClick={handleEditSave}>
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <span className="text-gray-700">{post.description}</span>
            )}
          </div>

          {/* Comments */}
          <div className="px-4 pt-2 mt-2 border-t space-y-1">
            {showToggleButton && (
              <button
                onClick={toggleComments}
                className="text-sm text-gray-400 hover:underline mb-1"
              >
                {visibleComments >= post.comments.length
                  ? "Hide comments"
                  : `View all ${post.comments.length} comments`}
              </button>
            )}

            {post.comments.slice(0, visibleComments).map((comment, index) => (
              <div key={index} className="text-sm">
                <Link href={`/${comment.user}`}>
                  <span className="font-semibold mr-1">{comment.user}</span>
                </Link>
                <span>{comment.text}</span>
                {comment.createdAt && (
                  <span className="text-gray-400 text-xs ml-2">
                    {format(comment.createdAt)}
                  </span>
                )}
              </div>
            ))}

            {/* Add Comment */}
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-sm"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="text-blue-500 hover:text-blue-600"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
