"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import type React from "react";
import { Footer } from "@/components/Footer";
import { CreateIdentityClient, IdentityClient } from "aether-identity";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPage() {
  const [step, setStep] = useState<"email" | "code" | "password">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur lors de l'envoi du code");
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setStep("code");
        setIsTransitioning(false);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Code invalide");
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setStep("password");
        setIsTransitioning(false);
        setIsLoading(false);
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "code") {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep("email");
        setCode("");
        setIsTransitioning(false);
      }, 300);
    } else if (step === "password") {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep("code");
        setNewPassword("");
        setConfirmPassword("");
        setIsTransitioning(false);
      }, 300);
    }
  };

  if (success) {
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
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#e8f5e9] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-[#2e7d32]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold mb-2 text-[#1b1b1b]">
                Mot de passe réinitialisé
              </h1>
              <p className="text-[15px] text-[#605e5c] mb-4">
                Votre mot de passe a été modifié avec succès.
              </p>
              <p className="text-[13px] text-[#605e5c]">
                Redirection vers la page de connexion...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div
          className={`bg-white rounded-sm shadow-lg p-11 mb-4 transition-all duration-300 ${isTransitioning ? "opacity-0 translate-x-5" : "opacity-100 translate-x-0"}`}
        >
          <div className="mb-6">
            <span className="text-[15px] font-semibold text-[#5e5e5e]">
              Sky Genesis Enterprise
            </span>
          </div>

          {step === "email" && (
            <>
              <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
                Réinitialiser le mot de passe
              </h1>
              <p className="text-[15px] text-[#605e5c] mb-6">
                Entrez l&apos;adresse e-mail associée à votre compte. Nous vous
                enverrons un code de vérification.
              </p>

              <form onSubmit={handleEmailSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    className="w-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 hover:border-[#323130] transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Link
                    href="/login"
                    className="px-6 py-1.5 text-[15px] text-[#1b1b1b] bg-[#edebe9] hover:bg-[#e1dfdd] border border-transparent focus:outline-none focus:border-[#8a8886]"
                  >
                    Retour
                  </Link>
                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Envoi..." : "Suivant"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "code" && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-1 mb-6 text-[13px] text-[#0067b8] hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                {email}
              </button>

              <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
                Entrez le code de vérification
              </h1>
              <p className="text-[15px] text-[#605e5c] mb-6">
                Nous avons envoyé un code à 6 chiffres à votre adresse e-mail.
              </p>

              <form onSubmit={handleCodeSubmit}>
                {error && (
                  <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Code à 6 chiffres"
                    maxLength={6}
                    autoFocus
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
                    disabled={isLoading || code.length !== 6}
                    className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Vérification..." : "Vérifier"}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "password" && (
            <>
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
            </>
          )}
        </div>
      </div>

      <Footer variant="absolute" />
    </div>
  );
}
