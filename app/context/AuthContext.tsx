"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRedirectUrl, NAVIGATION_CONFIG } from "@/config/navigation";
import {
  CreateIdentityClient,
  IdentityClient,
  OAuthParams,
} from "aether-identity";

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

let identityClient: IdentityClient | null = null;

function getIdentityClient(): IdentityClient {
  if (!identityClient) {
    identityClient = CreateIdentityClient({
      baseUrl:
        process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:3001",
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
      systemKey: process.env.NEXT_PUBLIC_IDENTITY_SYSTEM_KEY,
      totp: {
        issuer: "Sky Genesis Enterprise",
        digits: 6,
        period: 30,
      },
    });
  }
  return identityClient;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const identityRef = useRef<IdentityClient | null>(null);

  useEffect(() => {
    identityRef.current = getIdentityClient();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const identity = identityRef.current;
    if (!identity) {
      setIsLoading(false);
      return;
    }

    const isAuth = identity.session.isAuthenticated();
    if (isAuth) {
      try {
        const session = await identity.session.current();
        if (session.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
          });
        }
      } catch {
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  const login = async (
    email: string,
    password: string,
    oauthParams?: OAuthParams,
  ) => {
    setIsLoading(true);
    try {
      const identity = identityRef.current;
      if (!identity) {
        throw new Error("Identity client not initialized");
      }

      await identity.auth.login({ email, password }, oauthParams);

      await checkAuth();

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
      const identity = identityRef.current;
      if (identity) {
        await identity.auth.logout();
      }
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
