"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../providers/UserProvider";

const SingInPage = () => {
  const { setUser } = useContext(UserContext);
  const router = useRouter();
  const [passwordShown, setPasswordShown] = useState(false);
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    const response = await fetch("http://localhost:5500/signin", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ credential, password }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      setUser(data.body);
      router.push("/");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Signin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Enter your email, phone or username..."
              value={credential}
              onChange={(e) => {
                setCredential(e.target.value);
              }}
            />
            <div className="relative">
              <Input
                placeholder="Password..."
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                type={passwordShown ? "text" : "password"}
              />
              <Button
                onClick={() => {
                  setPasswordShown(!passwordShown);
                }}
                variant="ghost"
                className="absolute right-0 top-0"
              >
                {passwordShown ? <Eye /> : <EyeClosed />}
              </Button>
            </div>
            <Button onClick={handleSignin}>Sign in</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SingInPage;
