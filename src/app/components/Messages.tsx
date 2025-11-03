"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type SuggestedUser = {
  _id: string;
  username: string;
  fullname: string;
  avatarUrl?: string;
};

type Props = {
  users: SuggestedUser[];
};

export default function Suggested({ users }: Props) {
  return (
    <div className="w-80">
      <h2 className="text-sm font-semibold text-gray-500 mb-4">
        Suggested for You
      </h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <Link
              href={`/${user.username}`}
              className="flex items-center gap-3"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={
                    user.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.username
                    )}&background=random&size=64`
                  }
                />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-card-foreground">
                  {user.username}
                </span>
                <span className="text-xs text-gray-500">{user.fullname}</span>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600"
              onClick={() => alert(`Followed ${user.username}`)}
            >
              Follow
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
