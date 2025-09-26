"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";

const SignUpPage = () => {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  const handleSignUp = async () => {
    if (password === password2) {
      const response = await fetch("http://localhost:5500/signup", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ credential, password, fullname, username }),
      });

      const data = await response.json();

      if (response.ok) {
        redirectToSignFYP();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
  };
  const redirectToSignin = () => (window.location.href = "../signin/");
  const redirectToSignFYP = () => (window.location.href = "../signin/");

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Button
        className="absolute top-2 right-2 p-4 text-white rounded"
        onClick={redirectToSignin}
      >
        Already have an account? Sign in!
      </Button>

      <Card className="w-96">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Credential..."
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
            />
            <Input
              placeholder="Full Name..."
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <Input
              placeholder="Username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="relative">
              <Input
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordShown ? "text" : "password"}
              />
              <Button
                onClick={() => setPasswordShown(!passwordShown)}
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                {passwordShown ? <Eye /> : <EyeClosed />}
              </Button>
            </div>
            <div className="relative">
              <Input
                placeholder="Confirm Password..."
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                type={passwordShown ? "text" : "password"}
              />
              <Button
                onClick={() => setPasswordShown(!passwordShown)}
                variant="ghost"
                className="absolute right-1 top-1 h-8 w-8 p-0"
              >
                {passwordShown ? <Eye /> : <EyeClosed />}
              </Button>
            </div>
            <ul className="text-sm text-gray-600 ml-2">
              <li>Minimum 6 characters</li>
              <li>At least one lowercase letter</li>
              <li>At least one uppercase letter</li>
              <li>At least one digit</li>
              <li>At least one special character</li>
              <li>Passwords match</li>
            </ul>

            <Button onClick={handleSignUp}>Sign Up</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
