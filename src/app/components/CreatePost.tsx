"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  description: string;
  setDescription: (val: string) => void;
  imageUrl: string;
  setImageUrl: (val: string) => void;
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
}: Props) {
  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3">
        <Input
          placeholder="What's on your mind?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <Button
          onClick={createPost}
          disabled={posting || !description || !imageUrl}
        >
          {posting ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
}
