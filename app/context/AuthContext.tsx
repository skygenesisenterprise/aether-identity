"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getRedirectUrl, NAVIGATION_CONFIG } from "@/config/navigation";

type User = {
  id: string;
  email: string;
  name: string;
  role: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    oauthParams?: OAuthParams,
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

interface OAuthParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Vérifier l'authentification au montage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(false);
  };

  const login = async (
    email: string,
    password: string,
    oauthParams?: OAuthParams,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de la connexion");
      }

      // Recharger l'utilisateur après authentification
      await checkAuth();

      // Déterminer la redirection
      const redirectUrl = getRedirectUrl(
        !!oauthParams,
        oauthParams || {},
        user?.role,
      );

      router.push(redirectUrl);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push(NAVIGATION_CONFIG.LOGIN_PAGE);
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      router.push(NAVIGATION_CONFIG.LOGIN_PAGE);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(NAVIGATION_CONFIG.LOGIN_PAGE);
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
