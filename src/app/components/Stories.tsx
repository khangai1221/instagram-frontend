"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = { _id: string; username: string };

export default function Stories({ users }: { users: User[] }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto flex gap-4 scrollbar-hide">
      {users.map((u, idx) => (
        <div key={u._id || idx} className="flex flex-col items-center gap-1">
          <Avatar className="w-16 h-16 border-2 border-pink-500 p-1 rounded-full">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                u.username
              )}&background=random&size=64`}
            />
            <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="text-xs truncate w-16 text-center">
            {u.username}
          </span>
        </div>
      ))}
    </section>
  );
}
