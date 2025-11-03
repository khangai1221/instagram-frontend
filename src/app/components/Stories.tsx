"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

type Story = {
  _id: string;
  username: string;
  avatarUrl?: string;
};

type StoriesProps = {
  users: Story[];
};

export default function Stories({ users }: StoriesProps) {
  const router = useRouter();

  return (
    <div className="flex gap-4 overflow-x-auto py-4 px-2 border-b border-gray-800">
      {users.map((user) => {
        const avatarUrl =
          user.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.username
          )}&background=random&size=64`;

        return (
          <Button
            key={user._id}
            variant="ghost"
            className="flex flex-col items-center gap-1 p-0 min-w-[70px]"
            onClick={() => router.push(`/${user.username}`)}
          >
            <Avatar className="w-14 h-14">
              <AvatarImage src={avatarUrl} alt={user.username} />
              <AvatarFallback>
                {user.username[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-center truncate w-full">
              {user.username}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
