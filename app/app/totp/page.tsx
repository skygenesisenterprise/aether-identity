"use client";

import { Footer } from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function TotpPage() {
  const [totpCode, setTotpCode] = useState("");
  const [isTransitioning] = useState(false);
  const [error, setError] = useState("");

  const { isLoading, verifyTotp } = useAuth();
  const router = useRouter();

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await verifyTotp(totpCode);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Code TOTP invalide");
    }
  };

  const handleBack = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen relative bg-[#e8eef4] flex items-center justify-center p-4">
      {/* Background pattern - subtle hexagon shapes */}
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

      {/* Main card container */}
      <div className="relative z-10 w-full max-w-md">
        {/* TOTP card */}
        <div
          className={`bg-white rounded-sm shadow-lg p-11 mb-4 transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 translate-x-5"
              : "opacity-100 translate-x-0"
          }`}
        >
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
            Entrer le code TOTP
          </h1>

          {/* Form */}
          <form onSubmit={handleTotpSubmit}>
            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
                {error}
              </div>
            )}

            {/* TOTP input */}
            <div className="mb-4">
              <input
                type="text"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value)}
                placeholder="Code à six chiffres"
                maxLength={6}
                autoFocus
                className="w-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 hover:border-[#323130] transition-colors"
              />
            </div>

            {/* Buttons */}
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
                disabled={isLoading || totpCode.length !== 6}
                className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Vérification en cours..." : "Valider"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer variant="absolute" />  
    </div>
  );
}
