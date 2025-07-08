"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  getTokenFromCookie,
  getUserFromToken,
  type DecodedUser,
} from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type AuthContextValue = {
  user: DecodedUser | null;
  token: String | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [token, setToken] = useState<String | null>(null);
  const router = useRouter();

  useEffect(() => {
    const user = getUserFromToken();
    const token = getTokenFromCookie();
    setToken(token);
    setUser(user);
  }, []);

  const login = (token: string) => {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
    const decoded = getUserFromToken();
    setToken(token);
    setUser(decoded);
  };

  const logout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
    setToken(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within <AuthProvider>");
  return context;
};
