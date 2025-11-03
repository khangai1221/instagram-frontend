/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
  LogOut,
  X,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserContext } from "../providers/UserProvider";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentUserAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.username || "User"
  )}&background=random&size=64`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  const navItems = [
    { label: "Home", icon: <Home />, path: "/" },
    { label: "Search", icon: <Search />, path: "/search" },
    { label: "Explore", icon: <Compass />, path: "/explore" },
    { label: "Messages", icon: <MessageCircle />, path: "/messages" },
    { label: "Notifications", icon: <Heart />, path: "/notifications" },
    { label: "Create", icon: <PlusSquare />, path: "/create" },
  ];

  const NavButton = ({ label, icon, path }: any) => (
    <Button
      variant="ghost"
      className="justify-start text-lg hover:bg-gray-900 w-full"
      onClick={() => {
        router.push(path);
        setMobileOpen(false);
      }}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 bg-black border-r border-gray-800 text-white p-4 justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-8 text-center">Instagram</h1>
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavButton key={item.label} {...item} />
            ))}
            <Button
              variant="ghost"
              className="justify-start text-lg hover:bg-gray-900 w-full"
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

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between bg-black p-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold">Instagram</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <PlusSquare className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-95 z-50 p-6 flex flex-col justify-between">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavButton key={item.label} {...item} />
            ))}
            <Button
              variant="ghost"
              className="justify-start text-lg hover:bg-gray-900 w-full"
              onClick={() => {
                router.push(`/${user?.username}`);
                setMobileOpen(false);
              }}
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
        </div>
      )}
    </>
  );
}
