"use client";

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "./providers/UserProvider";

import Header from "./components/Header";
import Stories from "./components/Stories";
import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import Sidebar from "./components/SideBar";

type User = {
  _id: string;
  username: string;
  fullname: string;
};

type PostType = {
  _id: string;
  user: {
    _id: string;
    username: string;
    fullname: string;
  };
  imageUrl: string;
  description: string;
  liked: boolean;
  likes: number;
  likedUsers?: string[];
};

type JWTPayload = {
  id: string;
  username: string;
  fullname?: string;
};

export default function Home() {
  const { user, setUser } = useContext(UserContext);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostDescription, setNewPostDescription] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [posting, setPosting] = useState(false);

  const router = useRouter();

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
    } catch (err) {
      console.error("JWT invalid:", err);
      localStorage.removeItem("token");
      router.push("/signin");
    } finally {
      setLoading(false);
    }
  }, [router, setUser]);

  useEffect(() => {
    if (!user) return;

    async function fetchUsers() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:5500/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data: { body: User[]; message: string } = await res.json();

        if (res.ok) {
          setUsers(data.body);
        } else {
          console.error("Error fetching users:", data.message);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    }

    fetchUsers();
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;

    async function fetchPosts() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch("http://localhost:5500/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error("Error fetching posts");
          return;
        }

        setPosts(
          (data || []).map((p: PostType) => ({
            ...p,
            liked: p.likedUsers?.includes(user._id) ?? false,
            likes: Number(p.likes) || 0,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    }

    fetchPosts();
  }, [user?._id]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Redirecting...</div>;

  const toggleLike = async (postId: string) => {
    if (!user) return;

    const post = posts.find((p) => p._id === postId);
    if (!post) return;

    try {
      const res = await fetch(`http://localhost:5500/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Error liking post:", data.message);
        return;
      }

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, liked: !p.liked, likes: data.likes ?? p.likes }
            : p
        )
      );
    } catch (err) {
      console.error("Failed to like post:", err);
    }
  };

  const createPost = async () => {
    if (!newPostDescription || !newPostImage || !user) return;

    setPosting(true);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5500/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: newPostDescription,
          imageUrl: newPostImage,
          userId: user._id,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Failed to create post:", data.message);
        setPosting(false);
        return;
      }

      setPosts((prev) => [
        {
          _id: data.body._id,
          user: {
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
          },
          imageUrl: newPostImage,
          description: newPostDescription,
          liked: false,
          likes: 0,
        },
        ...prev,
      ]);

      setNewPostDescription("");
      setNewPostImage("");
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />
      <Stories users={users} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6 py-6">
        <section className="lg:col-span-2 flex flex-col">
          <CreatePost
            description={newPostDescription}
            setDescription={setNewPostDescription}
            imageUrl={newPostImage}
            setImageUrl={setNewPostImage}
            createPost={createPost}
            posting={posting}
          />

          {posts.map((post) => (
            <PostCard key={post._id} post={post} toggleLike={toggleLike} />
          ))}
        </section>

        <Sidebar username={user.username} fullname={user.fullname} />
      </main>
    </div>
  );
}
