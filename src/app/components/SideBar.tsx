"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = { username: string; fullname: string };

export default function Sidebar({ username, fullname }: Props) {
  const router = useRouter();
  const currentUserAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    username || "User"
  )}&background=0D8ABC&color=fff&size=64`;

  const switchAcc = () => router.push("/signin");

  return (
    <aside className="hidden lg:block space-y-4 text-white">
      <Card className="bg-gray-900 border border-gray-800">
        <CardContent className="p-4 flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUserAvatar} />
            <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{username}</div>
            <div className="text-sm text-gray-400">{fullname}</div>
          </div>
          <Button
            variant="link"
            size="sm"
            onClick={switchAcc}
            className="text-blue-400"
          >
            Switch
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
