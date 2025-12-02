"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";

import { UserContext } from "../providers/UserProvider";

const SignInPage = () => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignin = async () => {
    console.log("handleSignin called");
    if (!credential || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      console.log("Making signin request to:", "/api/signin");
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, password }),
      });

      console.log("Signin fetch completed, status:", res.status);

      const data = await res.json();
      console.log("Signin response:", res.status, data);

      if (!res.ok) {
        toast.error(data.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Save JWT and user in localStorage
      if (data.body && data.body.token) {
        localStorage.setItem("token", data.body.token);
        localStorage.setItem("user", JSON.stringify(data.body));
      }

      // Update UserContext
      if (data.body) {
        setUser({
          _id: data.body._id,
          username: data.body.username,
          fullname: data.body.fullname,
          email: data.body.email,
          phone: data.body.phone,
        });
      }

      toast.success(data.message || "Signed in successfully");

      setCredential("");
      setPassword("");
      router.push("/"); // Redirect to home
    } catch (err) {
      console.error("Signin error:", err);
      toast.error("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      <div className="flex flex-1 justify-center items-center gap-12 px-2 sm:px-4">
        <div className="hidden md:flex">
          <Image
            src="/instagram-photo.png"
            alt="Instagram showcase"
            width={400}
            height={600}
            priority
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold mb-6 font-sans tracking-tight">
            Instagram
          </h1>

          <Card className="w-[350px] border border-gray-700 shadow-sm bg-black">
            <CardContent className="p-6 flex flex-col gap-4">
              <Input
                placeholder="Phone number, username, or email"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className="rounded-md bg-gray-900 text-white placeholder-gray-400"
              />

              <div className="relative">
                <Input
                  placeholder="Password"
                  type={passwordShown ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-md pr-10 bg-gray-900 text-white placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setPasswordShown(!passwordShown)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {passwordShown ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>
              </div>

              <Button
                onClick={handleSignin}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 w-full text-white font-semibold rounded-md"
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>

              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-500 text-sm font-semibold">OR</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              <Button
                variant="ghost"
                className="w-full text-blue-400 font-semibold hover:bg-transparent"
              >
                Continue with Facebook
              </Button>
            </CardContent>
          </Card>

          <div className="w-[350px] border border-gray-700 mt-3 p-4 text-center text-sm">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-500 font-semibold"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      <footer className="text-xs text-gray-500 flex flex-col items-center gap-4 p-6">
        <ul className="flex flex-wrap justify-center gap-4 max-w-[900px] text-center">
          <li>Meta</li>
          <li>About</li>
          <li>Blog</li>
          <li>Jobs</li>
          <li>Help</li>
          <li>API</li>
          <li>Privacy</li>
          <li>Terms</li>
          <li>Locations</li>
          <li>Instagram Lite</li>
          <li>Meta AI</li>
          <li>Meta AI Articles</li>
          <li>Threads</li>
          <li>Contact Uploading & Non-Users</li>
          <li>Meta Verified</li>
        </ul>
        <div className="flex gap-4">
          <span>English</span>
          <span>© 2025 Instagram from Meta</span>
        </div>
      </footer>
    </div>
  );
};

export default SignInPage;
