"use client";

import { useContext } from "react";
import { UserContext } from "./providers/UserProvider";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { user, setUser } = useContext(UserContext);

  if (!user) {
    redirect("/signin");
  }

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      Welcome home page: {user?.fullname}{" "}
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}
