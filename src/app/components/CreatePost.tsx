"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type CreatePostProps = {
  description: string;
  setDescription: (desc: string) => void;
  imageUrl: string;
  setImageUrl: (url: string) => void;
  createPost: () => void;
  posting: boolean;
};

export default function CreatePost({
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  createPost,
  posting,
}: CreatePostProps) {
  return (
    <Card className="p-4 mb-6">
      <CardContent className="flex flex-col gap-3">
        <Input
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Enter image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        {/* Show image if URL is valid */}
        {imageUrl && (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md overflow-hidden">
            <Image
              src={imageUrl}
              alt="Post image"
              width={400}
              height={400}
              className="object-cover w-full h-full"
            />
          </div>
        )}

        <Button
          onClick={createPost}
          disabled={posting || !imageUrl || !description}
        >
          {posting ? "Posting..." : "Create Post"}
        </Button>
      </CardContent>
    </Card>
  );
}
