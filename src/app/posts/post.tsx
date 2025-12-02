"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Post = {
  _id: string;
  description: string;
  imageUrl: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const API_URL = "/api";
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newDescription || !newImageUrl) return;

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newDescription,
          imageUrl: newImageUrl,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPosts([data.body, ...posts]);
        setNewDescription("");
        setNewImageUrl("");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        setPosts(posts.filter((p) => p._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleUpdatePost = async (id: string) => {
    const updatedDescription = prompt("New description:");
    const updatedImageUrl = prompt("New image URL:");
    if (!updatedDescription || !updatedImageUrl) return;

    try {
      const res = await fetch(`${API_URL}/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: updatedDescription,
          imageUrl: updatedImageUrl,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setPosts(posts.map((p) => (p._id === id ? data : p)));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

      {/* 🔹 Create Post */}
      <Card className="p-4">
        <CardContent className="flex flex-col gap-3">
          <Input
            placeholder="What's on your mind?"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Input
            placeholder="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <Button onClick={handleCreatePost}>Create Post</Button>
        </CardContent>
      </Card>

      {/* 🔹 Posts Feed */}
      <div className="flex flex-col gap-4">
        {posts.map((post, index) => (
          <Card key={post._id ?? index}>
            <CardContent>
              <div className="flex flex-col gap-2">
                {post.imageUrl ? (
                  <Image
                    src={
                      isValidUrl(post.imageUrl)
                        ? post.imageUrl
                        : `/${post.imageUrl}`
                    }
                    alt={post.description || "Post image"}
                    width={800}
                    height={400}
                    className="w-full max-h-80 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-80 bg-gray-200 flex items-center justify-center">
                    No image
                  </div>
                )}
                <p></p>
                <div className="font-semibold">{post.description}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => handleUpdatePost(post._id)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeletePost(post._id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
