"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterForgotPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email");
  const code = searchParams.get("code");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !code) {
      setError(
        "Paramètres manquants. Veuillez reprendre le processus depuis le début.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de la réinitialisation");
      }

      router.push("/forgot/confirmed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (email && code) {
      router.push(
        `/forgot?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&step=code`,
      );
    } else {
      router.push("/forgot");
    }
  };

  return (
    <div className="min-h-screen relative bg-[#e8eef4] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <svg
          className="absolute top-20 right-40 w-96 h-96"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="100,10 172,50 172,130 100,170 28,130 28,50"
            fill="none"
            stroke="#0067b8"
            strokeWidth="0.5"
          />
          <polygon
            points="100,30 152,60 152,120 100,150 48,120 48,60"
            fill="none"
            stroke="#0067b8"
            strokeWidth="0.5"
          />
        </svg>
        <svg
          className="absolute top-60 left-20 w-64 h-64"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="100,10 172,50 172,130 100,170 28,130 28,50"
            fill="none"
            stroke="#50bfdc"
            strokeWidth="0.5"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-sm shadow-lg p-11 mb-4">
          <div className="mb-6">
            <span className="text-[15px] font-semibold text-[#5e5e5e]">
              Sky Genesis Enterprise
            </span>
          </div>

          <button
            onClick={handleBack}
            className="flex items-center gap-1 mb-6 text-[13px] text-[#0067b8] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
            Nouveau mot de passe
          </h1>
          <p className="text-[15px] text-[#605e5c] mb-6">
            Entrez votre nouveau mot de passe.
          </p>

          <form onSubmit={handlePasswordSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
                {error}
              </div>
            )}

            <div className="mb-4">
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nouveau mot de passe"
                minLength={8}
                className="w-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 hover:border-[#323130] transition-colors"
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmer le mot de passe"
                minLength={8}
                className="w-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 hover:border-[#323130] transition-colors"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-1.5 text-[15px] text-[#1b1b1b] bg-[#edebe9] hover:bg-[#e1dfdd] border border-transparent focus:outline-none focus:border-[#8a8886]"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
                className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Réinitialisation..." : "Réinitialiser"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 py-3 px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-[#605e5c]">
        <button className="hover:underline focus:underline">...</button>
        <a href="#" className="hover:underline focus:underline">
          Conditions d&apos;utilisation
        </a>
        <a href="#" className="hover:underline focus:underline">
          Confidentialité et cookies
        </a>
        <a href="#" className="hover:underline focus:underline">
          Accessibilité : partiellement conforme
        </a>
      </footer>
    </div>
  );
}
