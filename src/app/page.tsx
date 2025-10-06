"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "./providers/UserProvider";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Search,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

type User = {
  _id: string;
  username: string;
  fullname: string;
};

type Post = {
  _id: string;
  user?: string;
  avatar?: string;
  imageUrl: string;
  description: string;
  liked: boolean;
  likes: number;
};

type JWTPayload = {
  id: string;
  username: string;
  fullname?: string;
};

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check JWT and set user
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/signin");
      return;
    }

    try {
      const payload: JWTPayload = jwtDecode(token);
      if (!payload.id || !payload.username) throw new Error("Invalid token");

      setUser({
        _id: payload.id,
        username: payload.username,
        fullname: payload.fullname || "No Name",
        avatar: undefined,
        password: "",
        email: null,
        phone: null,
      });

      setLoading(false);
    } catch (err) {
      console.error("JWT invalid:", err);
      localStorage.removeItem("token");
      setLoading(false);
      router.push("/signin");
    }
  }, [router, setUser]);

  // Fetch users for stories
  useEffect(() => {
    async function fetchUsers() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5500/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: { body: User[]; message: string } = await res.json();

        if (!res.ok) {
          console.error("Error fetching users:", data.message);
          return;
        }

        setUsers(data.body);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }

    fetchUsers();
  }, []);

  // Fetch real posts
  useEffect(() => {
    async function fetchPosts() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5500/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: Post[] = await res.json();

        if (!res.ok) {
          console.error("Error fetching posts");
          return;
        }

        setPosts(
          (data || []).map((p) => ({
            ...p,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              p.user ?? "Unknown"
            )}&background=random&size=64`,
            liked: false,
            likes: Math.floor(Math.random() * 100) + 1,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    }

    fetchPosts();
  }, []);

  if (loading || !user) return <div>Loading...</div>;

  const toggleLike = (_id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p._id === _id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p
      )
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/signin");
  };

  const switchAcc = () => router.push("/signin");

  const currentUserAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.username
  )}&background=random&size=64`;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <h1
            className="text-5xl font-[GrandHotel]"
            style={{ fontFamily: "'Grand Hotel', cursive" }}
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
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <Button onClick={handleLogout}>Logout</Button>
          </nav>
        </div>
      </header>

      {/* Stories */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 overflow-x-auto flex gap-4 scrollbar-hide">
        {users.map((u, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1">
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

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        {/* Posts */}
        <section className="lg:col-span-2">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Card key={post._id} className="mb-6 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar>
                      <AvatarImage src={post.avatar} />
                      <AvatarFallback>
                        {(post.user?.[0] ?? "?").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex justify-between items-center">
                      <div className="text-sm font-semibold">
                        {post.user ?? "Unknown"}
                      </div>
                      <div className="text-xs text-gray-500">2h</div>
                    </div>
                  </div>
                  <Image
                    src={post.imageUrl}
                    alt={`post-${post._id}`}
                    width={800}
                    height={800}
                    className="w-full max-h-[720px] object-cover"
                  />
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
                    <div className="text-sm font-semibold mb-1">
                      {post.likes} likes
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold mr-1">
                        {post.user ?? "Unknown"}
                      </span>
                      <span className="text-gray-700">{post.description}</span>
                    </div>
                    <div className="mt-3">
                      <Input placeholder="Add a comment..." />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div>No posts yet</div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={currentUserAvatar} />
                <AvatarFallback>
                  {user.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-semibold">{user.username}</div>
                <div className="text-sm text-gray-500">{user.fullname}</div>
              </div>
              <Button variant="link" size="sm" onClick={switchAcc}>
                Switch
              </Button>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}
