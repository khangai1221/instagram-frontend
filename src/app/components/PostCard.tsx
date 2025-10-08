"use client";
import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type Post = {
  _id: string;
  user: { username: string };
  imageUrl: string;
  description: string;
  liked: boolean;
  likes: number;
};

export default function PostCard({
  post,
  toggleLike,
}: {
  post: Post;
  toggleLike: (id: string) => void;
}) {
  const username = post.user?.username ?? "Unknown";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    username
  )}&background=random&size=64`;

  return (
    <Card key={post._id} className="mb-6 overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 flex justify-between items-center">
            <div className="text-sm font-semibold">{username}</div>
            <div className="text-xs text-gray-500">2h</div>
          </div>
        </div>

        {post.imageUrl && (
          <Image
            src={post.imageUrl}
            alt={`post-${post._id}`}
            width={800}
            height={800}
            className="w-full max-h-[720px] object-cover"
          />
        )}

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
          <div className="text-sm">
            <span className="font-semibold mr-1">{username}</span>
            <span className="text-gray-700">{post.description}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
