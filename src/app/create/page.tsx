"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CreatePost() {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleCreatePost = async () => {
    if (!description && !imageUrl) return;

    try {
      const res = await fetch(
        "http://https://instagram-backend-gbgz.onrender.com/posts/upload",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, imageUrl }),
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Post created:", data);

      setDescription("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-lg shadow-md bg-black">
      <h2 className="text-center text-xl font-semibold mb-4">Create Post</h2>

      <Textarea
        placeholder="Write something..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 resize-none"
      />

      <Input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="mb-4"
      />

      {imageUrl && (
        <div className="mb-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full rounded-md object-cover max-h-64"
          />
        </div>
      )}

      <Button className="w-full" onClick={handleCreatePost}>
        Post
      </Button>
    </div>
  );
}
