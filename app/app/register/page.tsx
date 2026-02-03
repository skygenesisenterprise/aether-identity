"use client";

import type React from "react";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CreateIdentityClient, IdentityClient } from "aether-identity";

export default function RegisterPage() {
  const [step, setStep] = useState<"email" | "password" | "confirm">("email");
  const [username, setUsername] = useState("");
  const [domain, setDomain] = useState("aethermail.fr");
  const [availableDomains] = useState<string[]>([
    "aethermail.fr",
    "aethermail.me",
    "aethermail.be",
    "aethermail.de",
    "aethermail.ch",
    "aethermail.eu",
  ]);
  const [isDomainOpen, setIsDomainOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const identityRef = useRef<IdentityClient | null>(null);

  if (!identityRef.current) {
    identityRef.current = CreateIdentityClient({
      baseUrl:
        process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:3001",
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
      systemKey: process.env.NEXT_PUBLIC_IDENTITY_SYSTEM_KEY,
    });
  }

  // Dropdown animations
  const dropdownVariants = {
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.07,
        delayChildren: 0.05,
      },
    },
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const optionVariants = {
    open: {
      opacity: 1,
      y: 0,
      transition: {
        y: {
          type: "spring" as const,
          stiffness: 500,
          damping: 35,
        },
      },
    },
    closed: {
      opacity: 0,
      y: 10,
    },
  };

  const handleDomainClick = (selectedDomain: string) => {
    setDomain(selectedDomain);
    setIsDomainOpen(false);
  };

  const handleDomainToggle = () => {
    setIsDomainOpen(!isDomainOpen);
  };

  const getFullEmail = () => {
    if (!username.trim()) return " ";
    return `${username.trim()}@${domain}`;
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
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
      const identity = identityRef.current;
      if (!identity) {
        throw new Error("Identity client not initialized");
      }

      await identity.auth.register({
        email: `${username.trim()}@${domain}`,
        password,
      });

      router.push("/register/confirmed");
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
                {/* Email input with username and domain selector */}
                <div className="mb-4">
                  {/* Username and Domain on same line */}
                  <div className="flex items-stretch w-full">
                    {/* Username input */}
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="nomutilisateur"
                      required
                      className="flex-1 min-w-0 px-3 py-2 border border-r-0 border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 focus:border-r-2 focus:z-10 hover:border-[#323130] transition-colors"
                    />
                    {/* Domain selector */}
                    <div className="relative shrink-0">
                      <motion.button
                        type="button"
                        onClick={handleDomainToggle}
                        className="h-full px-3 py-2 border border-[#8a8886] bg-white text-[15px] text-[#1b1b1b] hover:border-[#323130] transition-colors flex items-center justify-between min-w-[140px] max-w-[180px]"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <span className="flex items-center gap-1 overflow-hidden">
                          <span className="text-[#605e5c] shrink-0">@</span>
                          <span className="truncate">{domain}</span>
                        </span>
                        <svg
                          className={`w-4 h-4 shrink-0 ml-1 transition-transform duration-200 ${isDomainOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </motion.button>
                      <AnimatePresence>
                        {isDomainOpen && (
                          <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="absolute right-0 z-10 w-56 mt-1 bg-white border border-[#8a8886] rounded-sm shadow-lg max-h-60 overflow-auto"
                            variants={dropdownVariants}
                          >
                            {availableDomains.map((domainOption) => (
                              <motion.button
                                key={domainOption}
                                onClick={() => handleDomainClick(domainOption)}
                                className="w-full px-4 py-2 text-left text-[15px] text-[#1b1b1b] hover:bg-[#f8f8f8] transition-colors"
                                variants={optionVariants}
                              >
                                {domainOption}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Email preview */}
                  <div className="mt-2 text-[13px] text-[#605e5c] text-center">
                    {username.trim()
                      ? `Votre adresse : ${username.trim()}@${domain}`
                      : "Entrez votre nom d'utilisateur"}
                  </div>
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
                {getFullEmail()}
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
                {getFullEmail()}
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
