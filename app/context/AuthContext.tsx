"use client";

import { createContext, useContext, useMemo, useEffect, useState } from "react";
// import { useSession, signIn, signOut } from "next-auth/react";
import { authService, LoginCredentials, AuthResult, User } from "../lib/services/backend-auth-service";

interface IAuthContext {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  logout: () => Promise<void>;
  signInWithKeycloak: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { data: session } = useSession();
  // const session = null;
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth from storage on mount
  useEffect(() => {
    authService.initializeFromStorage();
    const currentUser = authService.getUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  // Update user when session changes (for NextAuth compatibility)
  useEffect(() => {
    // Session handling disabled for now
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      // Also sign out from NextAuth if it's active
      // if (session) {
      //   signOut({ callbackUrl: '/login' });
      // }
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithKeycloak = () => {
    // Use NextAuth signIn for Keycloak SSO
    // signIn('keycloak', { callbackUrl: '/' });
  };

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    return authService.hasAnyPermission(permissions);
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    return authService.hasAllPermissions(permissions);
  };

  const value = useMemo<IAuthContext>(() => ({
    token: authService.getAccessToken() || null,
    isAuthenticated: authService.isAuthenticated() || false,
    user: user || null,
    isLoading,
    login,
    logout,
    signInWithKeycloak,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): IAuthContext {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
}
