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

  // Load token and user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, []);

  return (
    <UserContext.Provider value={{ user, token, loading, setUser, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
