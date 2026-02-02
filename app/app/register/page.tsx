"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CreateIdentityClient } from "aether-identity"

export default function RegisterPage() {
  const [step, setStep] = useState<"email" | "password" | "confirm">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Récupérer les paramètres OAuth depuis l'URL
  const isOAuth = searchParams.get("oauth") === "true";
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const responseType = searchParams.get("response_type");
  const scope = searchParams.get("scope");
  const state = searchParams.get("state");

  // Préparer les paramètres OAuth pour la redirection
  const oauthParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: responseType,
    scope: scope,
    state: state,
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep("password");
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }
    setError("");
    setIsTransitioning(true);
    setTimeout(() => {
      setStep("confirm");
      setIsTransitioning(false);
    }, 300);
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/v1/auth/register", {
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
        throw new Error(data.error || "Échec de l'inscription");
      }

      // Redirection vers la page de connexion après inscription réussie
      const queryParams = new URLSearchParams();
      if (isOAuth) {
        queryParams.set("oauth", "true");
        if (clientId) queryParams.set("client_id", clientId);
        if (redirectUri) queryParams.set("redirect_uri", redirectUri);
        if (responseType) queryParams.set("response_type", responseType);
        if (scope) queryParams.set("scope", scope);
        if (state) queryParams.set("state", state);
      }

      const redirectUrl = `/login${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      router.push(redirectUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "password") {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep("email");
        setPassword("");
        setIsTransitioning(false);
      }, 300);
    } else if (step === "confirm") {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep("password");
        setConfirmPassword("");
        setIsTransitioning(false);
      }, 300);
    }
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
        {/* Register card */}
        <div
          className={`bg-white rounded-sm shadow-lg p-11 mb-4 transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 translate-x-[-20px]"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="mb-6">
            <span className="text-[15px] font-semibold text-[#5e5e5e]">
              Sky Genesis Enterprise
            </span>
          </div>

          {step === "email" && (
            <>
              {/* Title */}
              <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
                Créer un compte
              </h1>

              {/* Form */}
              <form onSubmit={handleEmailSubmit}>
                {/* Email input */}
                <div className="mb-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Adresse e-mail"
                    required
                    className="w-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 hover:border-[#323130] transition-colors"
                  />
                </div>

                {/* Links */}
                <div className="mb-6 space-y-2">
                  <p className="text-[13px] text-[#1b1b1b]">
                    Vous avez déjà un compte ?{" "}
                    <Link
                      href="/login"
                      className="text-[#0067b8] hover:underline focus:underline"
                    >
                      Connectez-vous !
                    </Link>
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-2">
                  <Link
                    href="/login"
                    className="px-6 py-1.5 text-[15px] text-[#1b1b1b] bg-[#edebe9] hover:bg-[#e1dfdd] border border-transparent focus:outline-none focus:border-[#8a8886] inline-flex items-center"
                  >
                    Retour
                  </Link>
                  <button
                    type="submit"
                    className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886]"
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "password" && (
            <>
              {/* Email display with back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1 mb-6 text-[13px] text-[#0067b8] hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                {email}
              </button>

              <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
                Créer un mot de passe
              </h1>

              {/* Form */}
              <form onSubmit={handlePasswordSubmit}>
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
                    {error}
                  </div>
                )}

                {/* Password input */}
                <div className="mb-4">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mot de passe"
                    autoFocus
                    required
                    minLength={8}
                    className="w-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 hover:border-[#323130] transition-colors"
                  />
                </div>

                {/* Password requirements hint */}
                <div className="mb-6 text-[13px] text-[#605e5c]">
                  <p>Le mot de passe doit contenir au moins 8 caractères.</p>
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
                    className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886]"
                  >
                    Suivant
                  </button>
                </div>
              </form>
            </>
          )}

          {step === "confirm" && (
            <>
              {/* Email display with back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1 mb-6 text-[13px] text-[#0067b8] hover:underline"
              >
                <ChevronLeft className="w-4 h-4" />
                {email}
              </button>

              <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
                Confirmer le mot de passe
              </h1>

              {/* Form */}
              <form onSubmit={handleConfirmSubmit}>
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
                    {error}
                  </div>
                )}

                {/* Confirm password input */}
                <div className="mb-4">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    autoFocus
                    required
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
                    disabled={isLoading}
                    className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Création en cours..." : "Créer un compte"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
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
