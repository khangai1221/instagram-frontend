"use client";

import { useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserContext } from "../providers/UserProvider";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname(); // ✅ Detects current route

  const currentUserAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.username || "User"
  )}&background=0D8ABC&color=fff&size=64`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  // ✅ Helper to style active nav items
  const navButtonClass = (path: string) =>
    `justify-start text-lg ${
      pathname === path ? "bg-gray-900 font-semibold" : "hover:bg-gray-900"
    }`;

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-black border-r border-gray-800 text-white flex flex-col justify-between p-4">
      {/* Top Section */}
      <div>
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Instagram
        </h1>

        <nav className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className={navButtonClass("/")}
            onClick={() => router.push("/")}
          >
            <Home className="mr-3 w-5 h-5" /> Home
          </Button>

          <Button
            variant="ghost"
            className={navButtonClass("/search")}
            onClick={() => router.push("/search")}
          >
            <Search className="mr-3 w-5 h-5" /> Search
          </Button>

          <Button
            variant="ghost"
            className={navButtonClass("/explore")}
            onClick={() => router.push("/explore")}
          >
            <Compass className="mr-3 w-5 h-5" /> Explore
          </Button>

          <Button
            variant="ghost"
            className={navButtonClass("/messages")}
            onClick={() => router.push("/messages")}
          >
            <MessageCircle className="mr-3 w-5 h-5" /> Messages
          </Button>

          <Button
            variant="ghost"
            className={navButtonClass("/notifications")}
            onClick={() => router.push("/notifications")}
          >
            <Heart className="mr-3 w-5 h-5" /> Notifications
          </Button>

          <Button
            variant="ghost"
            className={navButtonClass("/create")}
            onClick={() => router.push("/create")}
          >
            <PlusSquare className="mr-3 w-5 h-5" />
            Create
          </Button>

          <Button
            variant="ghost"
            className={navButtonClass(`/${user?.username}`)}
            onClick={() => router.push(`/${user?.username}`)}
          >
            <Avatar className="mr-3 w-6 h-6">
              <AvatarImage src={currentUserAvatar} alt="Profile" />
              <AvatarFallback>
                {user?.username?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            Profile
          </Button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between border-t border-gray-800 pt-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={currentUserAvatar} alt="User Avatar" />
            <AvatarFallback>
              {user?.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-semibold">{user?.username}</p>
            <p className="text-gray-400 text-xs">View Profile</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="text-red-500 hover:text-red-600"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </aside>
  );
}
