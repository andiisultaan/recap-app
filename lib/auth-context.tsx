"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface UserData {
  nis: string;
  nama: string;
}

interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cookieString = document.cookie;
    const cookies = cookieString.split("; ").reduce((acc, cookie) => {
      const [key, value] = cookie.split("=");
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {} as Record<string, string>);

    const authUserCookie = cookies["auth_user"];
    if (authUserCookie) {
      try {
        setUser(JSON.parse(authUserCookie));
      } catch (e) {
        console.error("[v0] Failed to parse auth user cookie:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    const maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${maxAge}; SameSite=Strict`;
  };

  const logout = () => {
    setUser(null);
    document.cookie = "auth_user=; path=/; max-age=0; SameSite=Strict";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
