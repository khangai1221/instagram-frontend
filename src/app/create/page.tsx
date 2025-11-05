"use client";

import { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserContext } from "../providers/UserProvider";
import { useRouter } from "next/navigation";
export default function CreatePost() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userId, setUserId] = useState("");
  const { user, setUser } = useContext(UserContext);
  // Get userId from localStorage on component mount
  useEffect(() => {
    const user = localStorage.getItem("user"); // assume "user" stores JSON with _id
    if (user) {
      const parsed = JSON.parse(user);
      setUserId(parsed._id);
    }
  }, []);

  const handleCreatePost = async () => {
    if (!description && !imageUrl) return;

    if (!userId) {
      console.error("User ID not found. Are you logged in?");
      return;
    }

    try {
      const res = await fetch(
        "https://instagram-backend-gbgz.onrender.com/posts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, imageUrl, userId }),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("Server response:", text);
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log("Post created:", data);
      router.push("/");
      setDescription("");
      setImageUrl("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 rounded-lg shadow-md bg-black">
      <h2 className="text-center text-xl font-semibold mb-4 text-white">
        Create Post
      </h2>

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
