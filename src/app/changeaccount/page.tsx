"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface Account {
  id: string;
  username: string;
  token: string;
  avatarUrl?: string;
}

export default function SwitchAccount() {
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("currentAccount");
    if (stored) setCurrentAccount(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (currentAccount) {
      localStorage.setItem("currentAccount", JSON.stringify(currentAccount));
      localStorage.setItem("token", currentAccount.token);
    } else {
      localStorage.removeItem("currentAccount");
      localStorage.removeItem("token");
    }
  }, [currentAccount]);

  const handleSignin = async () => {
    if (!credential || !password) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5500/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signin failed");
        setLoading(false);
        return;
      }

      const user = data.body;
      const newAcc: Account = {
        id: user._id,
        username: user.username,
        token: user.token,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username
        )}&background=random&size=64`,
      };

      setCurrentAccount(newAcc);
      setCredential("");
      setPassword("");
      setLoading(false);

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentAccount(null);
    router.push("/signin");
  };

  return (
    <Card className="max-w-sm mx-auto shadow-lg rounded-2xl mt-10">
      <CardContent className="p-4 flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center">Switch Account</h2>

        {currentAccount ? (
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={currentAccount.avatarUrl} />
              <AvatarFallback>
                {currentAccount.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{currentAccount.username}</span>
            <Button onClick={handleLogout} variant="outline">
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Username, email, or phone"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleSignin} disabled={loading}>
              {loading ? "Signing in..." : "Login / Switch"}
            </Button>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
