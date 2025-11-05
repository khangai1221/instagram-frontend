"use client";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  _id: string;
  username: string;
  fullname: string;
  password: string;
  email: string | null;
  phone: string | null;
  avatar?: string;
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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Get token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken && storedToken !== "null") {
      setToken(JSON.parse(storedToken));
    } else {
      setLoading(false); // ✅ ensure it doesn’t get stuck
    }
  }, []);

  // Fetch user info when token changes
  useEffect(() => {
    const authenticateUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://instagram-backend-gbgz.onrender.com/me",
          {
            headers: { Authorization: "Bearer " + token },
          }
        );

        if (!response.ok) {
          throw new Error("Invalid token");
        }

        const data = await response.json();
        setUser(data.body);
      } catch (err) {
        console.error("Auth failed:", err);
        localStorage.removeItem("authToken");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false); // ✅ always stop loading
      }
    };

    authenticateUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, token, loading, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
