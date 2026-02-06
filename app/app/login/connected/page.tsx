"use client";

import { Footer } from "@/components/Footer";
import { CheckCircle } from "lucide-react";

export default function ConnectedPage() {
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
        {/* Connected card */}
        <div className="bg-white rounded-sm shadow-lg p-11 mb-4">
          <div className="mb-6">
            <span className="text-[15px] font-semibold text-[#5e5e5e]">
              Sky Genesis Enterprise
            </span>
          </div>

          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#107c10] flex items-center justify-center border-2 border-[#107c10] shadow-md">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-semibold mb-4 text-[#1b1b1b] text-center">
            Successfully Connected
          </h1>

          {/* Message */}
          <div className="text-center space-y-4">
            <p className="text-[15px] text-[#1b1b1b]">
              You have been successfully authenticated and connected to your
              account.
            </p>
            <p className="text-[13px] text-[#605e5c]">
              You can now close this window and return to your application. Your
              session is active and secure.
            </p>
          </div>

          {/* Optional close button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => window.close()}
              className="px-6 py-1.5 text-[15px] text-white bg-[#0067b8] hover:bg-[#005a9e] border border-transparent focus:outline-none focus:border-[#8a8886] transition-colors"
            >
              Close this window
            </button>
          </div>
        </div>
      </div>

      <Footer variant="absolute" />
    </div>
  );
}
