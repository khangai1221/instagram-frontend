"use client";

import { useEffect, useState, ChangeEvent, useContext, ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
type MyComponentProps = {
  children?: ReactNode;
};
export function RootLayout({ children }: MyComponentProps) {
  return (
    <html lang="en">
      <head />
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}

import { UserContext } from "../providers/UserProvider"; // make sure you have this

type Post = {
  _id: string;
  description: string;
  imageUrl: string;
};

export default function PostsPage() {
  const { user } = useContext(UserContext); // get logged-in user
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL;



  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      toast.error("Failed to fetch posts");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleCreatePost = async () => {
    if (!newDescription) {
      toast.error("Please add a description");
      return;
    }

    if (!user || !user._id) {
      toast.error("User not found, please login");
      return;
    }

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append("description", newDescription);
        formData.append("image", file);
        formData.append("userId", user._id);

        res = await fetch(`${API_URL}/posts`, {
          method: "POST",
          body: formData,
        });
      } else if (newImageUrl) {
        res = await fetch(`${API_URL}/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: newDescription,
            imageUrl: newImageUrl,
            userId: user._id,
          }),
        });
      } else {
        toast.error("Please provide an image URL or upload a file");
        return;
      }

      const data = await res.json();
      if (res.ok) {
        setPosts([data.body, ...posts]);
        setNewDescription("");
        setNewImageUrl("");
        setFile(null);
        toast.success("Post created successfully!");
        router.push("/");
      } else {
        toast.error(data.message || "Failed to create post");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating post");
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>

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
          <input type="file" accept="image/*" onChange={handleFileChange} />
          <Button onClick={handleCreatePost}>Create Post</Button>
        </CardContent>
      </Card>

      {/* <div className="flex flex-col gap-4">
        {posts.map((post) => (
          <Card key={post._id}>
            <CardContent>
              <div className="flex flex-col gap-2">
                {post?.imageUrl ? (
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
                <div className="font-semibold">{post.description}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div> */}
    </div>
  );
}
