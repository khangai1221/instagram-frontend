/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserContext } from "../providers/UserProvider";
import { jwtDecode } from "jwt-decode";
import { Progress } from "@/components/ui/progress"; // ⬅️ import Progress

type Profile = {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  bio?: string;
  website?: string;
  followers?: string[];
  following?: string[];
};

type Post = {
  _id: string;
  description?: string;
  imageUrl?: string;
  user: { _id: string; username: string };
};

export default function ProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(13);
  const [isFollowing, setIsFollowing] = useState(false);

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://instagram-backend-gbgz.onrender.com";

  // Animate progress bar while loading
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setProgress(66), 400);
      return () => clearTimeout(timer);
    } else {
      setProgress(100);
    }
  }, [loading]);

  // Authenticate user
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/signin");
      return;
    }

    try {
      const payload: any = jwtDecode(storedToken);
      if (!payload.id || !payload.username) throw new Error("Invalid token");

      setUser({
        _id: payload.id,
        username: payload.username,
        fullname: payload.fullname || "No Name",
        email: null,
        phone: null,
      });
    } catch (err) {
      console.error("Invalid JWT:", err);
      localStorage.removeItem("token");
      router.push("/signin");
    }
  }, [router, setUser]);

  // Fetch profile & posts
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        const profileRes = await fetch(`${API_URL}/users/${username}`);
        const profileData = await profileRes.json();

        setProfile({
          ...profileData,
          followers: profileData.followers || [],
          following: profileData.following || [],
        });

        setIsFollowing(profileData.followers?.includes(user?._id) || false);

        const postsRes = await fetch(
          `${API_URL}/posts?userId=${profileData._id}`
        );
        const postsData = await postsRes.json();
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching profile or posts:", err);
      } finally {
        setLoading(false);
      }
    };

    if (username) fetchProfileAndPosts();
  }, [username, user]);

  const toggleFollow = async () => {
    if (!user || !profile) return;

    try {
      const res = await fetch(`${API_URL}/users/${profile._id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followerId: user._id }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        alert(data.msg || data.message || "Failed to toggle follow");
        return;
      }

      setIsFollowing(data.isFollowing);
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              followers: data.followers,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
      alert("Network or server error while toggling follow");
    }
  };

  // ⏳ show loading progress bar
  if (loading)
    return (
      <div className="flex flex-col items-center mt-20">
        <Progress value={progress} className="w-[60%]" />
        <p className="mt-4 text-sm text-gray-500">Loading profile...</p>
      </div>
    );

  if (!profile)
    return <div className="text-center mt-10">Profile not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border border-gray-200">
          <Image
            src={
              profile.avatar ||
              `https://ui-avatars.com/api/?name=${profile.username}`
            }
            alt={profile.username}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">{profile.username}</h1>
            {user?._id !== profile._id && (
              <Button
                onClick={toggleFollow}
                className={`px-4 py-1 text-sm font-semibold rounded border ${
                  isFollowing
                    ? "bg-white text-black border-gray-300"
                    : "bg-blue-500 text-white border-blue-500"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-600">{profile.fullname}</p>
          {profile.bio && <p className="mt-2">{profile.bio}</p>}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 text-sm mt-1 inline-block"
            >
              {profile.website}
            </a>
          )}
          <div className="flex gap-6 mt-4 text-sm">
            <span>
              <strong>{posts.length}</strong> posts
            </span>
            <span>
              <strong>{profile.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{profile.following?.length || 0}</strong> following
            </span>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {posts.map((p) => (
          <div
            key={p._id}
            className="aspect-square bg-gray-200 relative group cursor-pointer"
            onClick={() => router.push(`/post/${p._id}`)}
          >
            <Image
              src={p.imageUrl || "/placeholder.png"}
              alt={p.description || "post"}
              fill
              sizes="(min-width: 1024px) 33vw, 100vw"
              className="object-cover group-hover:opacity-80 transition"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
