"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  username: string;
  fullname: string;
  email?: string | null;
  phone?: string | null;
};

type UserContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  token: null,
  loading: true,
  setUser: () => {},
  setToken: () => {},
});

export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(JSON.parse(storedToken));
    else setLoading(false);
  }, []);

  // Fetch user when token changes
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Invalid token");

        const data = await res.json();
        setUser(data.body);
      } catch (err) {
        console.error("Auth failed:", err);
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, loading, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
