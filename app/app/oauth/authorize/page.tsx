"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

export default function OAuthAuthorizePage() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [clientId, setClientId] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const generateAuthCode = useCallback(() => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  useEffect(() => {
    // Parse OAuth parameters from URL
    const clientIdParam = searchParams.get("client_id");
    const redirectUriParam = searchParams.get("redirect_uri");
    const stateParam = searchParams.get("state");
    const responseType = searchParams.get("response_type");

    let hasError = false;
    let errorMessage = "";

    if (!clientIdParam || !redirectUriParam || responseType !== "code") {
      hasError = true;
      errorMessage = "Invalid OAuth request";
    }

    // Batch state updates to avoid cascading renders
    if (hasError) {
      setError(errorMessage);
      setLoading(false);
      return;
    }

    // Generate authorization code first
    const authCode = generateAuthCode();

    // Then batch all state updates together
    setClientId(clientIdParam || "");
    setRedirectUri(redirectUriParam || "");
    setState(stateParam || "");
    setCode(authCode);
    setLoading(false);
  }, [searchParams, generateAuthCode]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleComplete = () => {
    // Redirect back to CLI with authorization code
    const callbackUrl = `${redirectUri}?code=${code}&state=${state}`;
    window.location.href = callbackUrl;
  };

  if (loading) {
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

        <div className="relative z-10 text-center">
          <div
            className="w-8 h-8 border-2 border-[#e5e7eb] border-t-2 border-t-[#0067b8] rounded-full mx-auto"
            style={{ animation: "spin 1s linear infinite" }}
          ></div>
          <p className="mt-2 text-[13px] text-[#605e5c]">
            Loading authorization...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
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

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-sm shadow-lg p-11 mb-4">
            <div className="mb-6">
              <span className="text-[15px] font-semibold text-[#5e5e5e]">
                Sky Genesis Enterprise
              </span>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
              Authorization Error
            </h2>
            <p className="text-[13px] text-[#1b1b1b] mb-4">
              There was a problem with the authorization request
            </p>

            <div className="bg-[#fef2f2] border border-[#fecaca] rounded p-3 mb-4">
              <p className="text-[13px] text-[#dc2626]">{error}</p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-1.5 text-[15px] text-[#1b1b1b] bg-[#edebe9] hover:bg-[#e1dfdd] border border-transparent focus:outline-none focus:border-[#8a8886]"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="bg-white rounded-sm shadow-lg p-11 mb-4">
          <div className="mb-6">
            <span className="text-[15px] font-semibold text-[#5e5e5e]">
              Sky Genesis Enterprise
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b]">
            Aether Vault Authorization
          </h1>
          <p className="text-[13px] text-[#605e5c] mb-6">
            Enter this code in your CLI to complete authentication
          </p>

          {/* Authorization Code Section */}
          <div className="mb-6">
            <label className="block text-[13px] text-[#1b1b1b] mb-2 font-medium">
              Authorization Code
            </label>
            <div className="flex gap-2">
              <input
                value={code}
                readOnly
                className="flex-1 px-3 py-2 border border-[#8a8886] bg-[#f9fafb] text-[15px] text-[#1b1b1b] font-mono text-center text-lg tracking-wider placeholder:text-[#605e5c] focus:outline-none focus:border-[#0067b8] focus:border-2 cursor-default"
                style={{ letterSpacing: "0.1em" }}
              />
              <button
                onClick={copyToClipboard}
                className="px-3 py-2 text-[#1b1b1b] bg-white border border-[#8a8886] hover:bg-[#f3f2f1] focus:outline-none focus:border-[#0067b8] transition-colors"
                title="Copy code"
              >
                {copied ? (
                  <svg
                    className="w-4 h-4"
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
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-[13px] text-[#605e5c] mt-2">
              This code will expire in 10 minutes
            </p>
          </div>

          {/* Instructions Section */}
          <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded p-3 mb-6">
            <div className="flex items-start gap-2">
              <svg
                className="w-4 h-4 text-[#0067b8] mt-0.5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              <div>
                <p className="text-[13px] text-[#1e40af] font-medium mb-1">
                  CLI Instructions
                </p>
                <p className="text-[13px] text-[#0067b8] mb-2">
                  Run this command in your terminal and enter code when
                  prompted:
                </p>
                <code className="block text-[12px] bg-[#dbeafe] p-2 rounded font-mono">
                  vault login --method oauth
                </code>
              </div>
            </div>
          </div>

          {/* OAuth Details */}
          <div className="space-y-2 text-[13px] text-[#605e5c] mb-6">
            <div className="flex justify-between">
              <span>Client ID:</span>
              <span className="font-mono">{clientId.substring(0, 8)}...</span>
            </div>
            <div className="flex justify-between">
              <span>Redirect URI:</span>
              <span className="font-mono truncate max-w-[200px]">
                {redirectUri}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => (window.location.href = "/")}
              className="px-6 py-1.5 text-[15px] text-[#1b1b1b] bg-[#edebe9] hover:bg-[#e1dfdd] border border-transparent focus:outline-none focus:border-[#8a8886]"
            >
              Annuler
            </button>
            <button
              onClick={handleComplete}
              disabled={!code}
              className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Authorization
            </button>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <p className="text-[13px] text-[#605e5c]">
              By authorizing, you allow this CLI to access your vault secrets
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 py-3 px-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-[#605e5c]">
        <button className="hover:underline focus:outline-none">...</button>
        <a href="#" className="hover:underline focus:outline-none">
          Conditions d&apos;utilisation
        </a>
        <a href="#" className="hover:underline focus:outline-none">
          Confidentialité et cookies
        </a>
        <a href="#" className="hover:underline focus:outline-none">
          Accessibilité : partiellement conforme
        </a>
      </footer>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
