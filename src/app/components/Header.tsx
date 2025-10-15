"use client";
import { Search, ChevronDown, MessageCircle, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { UserContext } from "../providers/UserProvider";
import { useContext } from "react";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const currentUserAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.username || "User"
  )}&background=random&size=64`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <h1
          className="text-5xl font-[GrandHotel]"
          style={{ fontFamily: "'Instagram Sans', bold" }}
        >
          Instagram
        </h1>
        <div className="hidden sm:flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1">
          <Search className="w-4 h-4 opacity-70" />
          <Input
            className="border-0 bg-transparent text-sm w-44 focus-visible:ring-0"
            placeholder="Search"
          />
        </div>
        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex items-center gap-1"
          >
            Explore <ChevronDown className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Send className="w-5 h-5" />
            </Button>
            <Avatar>
              <AvatarImage src={currentUserAvatar} />
              <AvatarFallback>{user?.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </nav>
      </div>
    </header>
  );
}
