"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  CreateIdentityClient,
  IdentityClient,
  TOTPSetupResponse,
} from "aether-identity";

export default function TotpRegisterPage() {
  const [totpSetup, setTotpSetup] = useState<TOTPSetupResponse | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const router = useRouter();
  const identityRef = useRef<IdentityClient | null>(null);

  if (!identityRef.current) {
    identityRef.current = CreateIdentityClient({
      baseUrl:
        process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:3000",
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID || "",
      systemKey: process.env.NEXT_PUBLIC_IDENTITY_SYSTEM_KEY,
      totp: {
        issuer: "Sky Genesis Enterprise",
        digits: 6,
        period: 30,
      },
    });
  }

  useEffect(() => {
    initTotpSetup();
  }, []);

  const initTotpSetup = async () => {
    try {
      const identity = identityRef.current;
      if (!identity) {
        throw new Error("Identity client not initialized");
      }

      const setup = await identity.totp.setup();
      setTotpSetup(setup);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to setup TOTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const identity = identityRef.current;
      if (!identity) {
        throw new Error("Identity client not initialized");
      }

      if (!totpSetup) {
        throw new Error("TOTP setup not initialized");
      }

      await identity.totp.verify({
        code: totpCode,
        secret: totpSetup.secret,
      });

      setVerified(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative bg-[#e8eef4] flex items-center justify-center p-4">
        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-sm shadow-lg p-11 mb-4">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0067b8]"></div>
            </div>
            <p className="text-center text-[15px] text-[#605e5c]">
              Configuration de l&apos;authentification à deux facteurs...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verified) {
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
                Authentification à deux facteurs activée
              </h1>
              <p className="text-[15px] text-[#605e5c]">
                Redirection vers le tableau de bord...
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
        <div className="bg-white rounded-sm shadow-lg p-11 mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 mb-6 text-[13px] text-[#0067b8] hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="text-2xl font-semibold mb-2 text-[#1b1b1b]">
            Configurer l&apos;authentification à deux facteurs
          </h1>
          <p className="text-[15px] text-[#605e5c] mb-6">
            Scannez ce code QR avec votre application d&apos;authentification
            (Google Authenticator, Microsoft Authenticator, etc.)
          </p>

          {error && (
            <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded text-[13px] text-[#c62828]">
              {error}
            </div>
          )}

          {totpSetup && (
            <>
              <div className="flex justify-center mb-6 p-4 bg-white border border-[#edebe9] rounded">
                <QRCodeSVG
                  value={totpSetup.url}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="mb-6 p-4 bg-[#f3f2f1] rounded text-[13px] text-[#605e5c]">
                <p className="font-medium mb-2 text-[#1b1b1b]">Clé secrète :</p>
                <p className="font-mono break-all mb-4">{totpSetup.secret}</p>
                <p className="text-xs">
                  Si vous ne pouvez pas scanner le code QR, entrez cette clé
                  manuellement dans votre application d&apos;authentification.
                </p>
              </div>

              <form onSubmit={handleTotpSubmit}>
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
                    disabled={isVerifying || totpCode.length !== 6}
                    className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? "Vérification..." : "Vérifier et activer"}
                  </button>
                </div>
              </form>
            </>
          )}
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
