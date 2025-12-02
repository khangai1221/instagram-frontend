"use client";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UserContext } from "../providers/UserProvider";

const SignUpPage = () => {
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  if (user) {
    router.push("/");
    return null;
  }

  const handleSignUp = async () => {
    const response = await fetch("/api/auth/signup", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ credential, password, fullname, username }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      router.push("/signin");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center bg-black-300">
      <div className="flex flex-col items-center gap-6 mt-10">
        <Card className="w-[350px] border border-black-300 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex flex-col items-center mb-6">
              <h1
                className="text-5xl font-[GrandHotel] tracking-tight mb-4"
                style={{ fontFamily: "'Grand Hotel', cursive" }}
              >
                Instagram
              </h1>

              <p className="text-gray-500 text-sm text-center">
                Sign up to see photos and videos from your friends.
              </p>
            </div>

            <Input
              placeholder="Mobile number or email"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
            <Input
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="relative">
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordShown ? "text" : "password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setPasswordShown(!passwordShown)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {passwordShown ? <Eye size={18} /> : <EyeClosed size={18} />}
              </button>
            </div>

            <div className="relative">
              <Input
                placeholder="Confirm Password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type={passwordShown ? "text" : "password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setPasswordShown(!passwordShown)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {passwordShown ? <Eye size={18} /> : <EyeClosed size={18} />}
              </button>
            </div>

            <ul className="text-xs text-gray-500 ml-2 space-y-1">
              <li>Minimum 6 characters</li>
              <li>At least one lowercase & uppercase letter</li>
              <li>At least one digit</li>
              <li>At least one special character</li>
              <li>Passwords match</li>
            </ul>

            <Button
              onClick={handleSignUp}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
            >
              Sign Up
            </Button>

            <p className="text-xs text-center text-gray-500 mt-2">
              By signing up, you agree to our{" "}
              <span className="font-semibold text-blue-500 cursor-pointer">
                Terms
              </span>
              ,{" "}
              <span className="font-semibold text-blue-500 cursor-pointer">
                Privacy Policy
              </span>{" "}
              and{" "}
              <span className="font-semibold text-blue-500 cursor-pointer">
                Cookies Policy
              </span>
              .
            </p>
          </CardContent>
        </Card>

        <Card className="w-[350px] border border-black-300 mt-3 p-4 text-center text-sm">
          Have an account?{" "}
          <button
            onClick={() => router.push("/signin")}
            className="text-blue-500 font-semibold"
          >
            Log in
          </button>
        </Card>
      </div>

      <footer className="text-xs text-gray-500 flex flex-col items-center gap-4 p-6 mt-6">
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

export default SignUpPage;
