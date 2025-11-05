/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!query.trim()) return setResults([]);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users?search=${query}`
        );
        const data = await res.json();
        setResults(data.body || []);
      } catch (err) {
        console.error("Search failed", err);
      }
    };
    fetchUsers();
  }, [query]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <Input
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="mt-4 flex flex-col gap-2">
        {results.map((user) => (
          <Button
            key={user._id}
            variant="ghost"
            className="justify-start gap-3"
            onClick={() => router.push(`/${user.username}`)}
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={user.avatar || ""} />
              <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="font-semibold">{user.username}</p>
              <p className="text-gray-400 text-xs">{user.fullname}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
