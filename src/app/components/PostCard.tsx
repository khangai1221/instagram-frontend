"use client";

import { useState } from "react";
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
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { format } from "timeago.js";

type Comment = {
  user: string;
  text: string;
  createdAt?: string;
};

type Post = {
  _id: string;
  user: { _id?: string; username: string };
  imageUrl: string;
  description: string;
  liked: boolean;
  likes: number;
  createdAt: string;
  updatedAt?: string;
  comments?: Comment[];
};

type PostCardProps = {
  post: Post;
  currentUserId: string;
  toggleLike: (id: string) => void;
  editPost: (id: string, newDescription: string) => void;
  deletePost: (id: string) => void;
};

export default function PostCard({
  post,
  currentUserId,
  toggleLike,
  editPost,
  deletePost,
}: PostCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(post.description);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [newComment, setNewComment] = useState("");

  const username = post.user?.username ?? "Unknown";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    username
  )}&background=random&size=64`;

  const isOwner = post.user?._id === currentUserId;

  const handleEditSave = () => {
    if (editedDescription.trim() !== post.description) {
      editPost(post._id, editedDescription);
    }
    setIsEditing(false);
  };
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(
        `http://localhost:5500/posts/${post._id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: newComment,
            userId: currentUserId,
            username: username, // current user's username
          }),
        }
      );

      if (res.ok) {
        const updatedPost = await res.json();
        setComments(updatedPost.comments);
        setNewComment("");
      } else {
        console.error("Failed to save comment on server");
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <Card key={post._id} className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm font-semibold">{username}</div>
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

        {/* Image */}
        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={`post-${post._id}`}
            width={800}
            height={800}
            className="w-full max-h-[720px] object-cover"
          />
        )}

        {/* Like/comment/share */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleLike(post._id)}
              >
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

          <div className="text-sm font-semibold mb-1">{post.likes} likes</div>

          {/* Description / Edit field */}
          <div className="text-sm">
            <span className="font-semibold mr-1">{username}</span>
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
                  onClick={() => {
                    setEditedDescription(post.description);
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <span className="text-gray-700">{post.description}</span>
            )}
          </div>

          {/* Comments Section */}
          {/* Comments Section */}
          <div className="px-4 pt-2 mt-2 border-t">
            <div className="space-y-1 mb-2">
              {comments.length > 0 ? (
                comments.map((comment, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-semibold mr-1">{comment.user}:</span>
                    <span>{comment.text}</span>
                    {comment.createdAt && (
                      <span className="text-gray-400 text-xs ml-2">
                        {format(comment.createdAt)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No comments yet</div>
              )}
            </div>

            {/* Add Comment Input */}
            <div className="flex items-center gap-2">
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
