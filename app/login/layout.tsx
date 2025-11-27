"use client";

import { AuthProvider } from "../context/JwtAuthContext";
import { Toaster } from "../components/ui/toaster";

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}