"use client";

import { useState } from "react";

export function SplitViewer({
  left,
  right,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<"summary" | "transcript">("summary");

  return (
    <div className="w-full border border-white/10 rounded-[--radius-lg] overflow-hidden bg-surface/60 backdrop-blur">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 bg-[--color-surface-2]">
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
            activeTab === "summary"
              ? "text-[--color-brand-100] bg-gradient-to-b from-[--color-brand-500]/10 to-transparent"
              : "text-[--color-muted] hover:text-[--color-foreground] hover:bg-white/5"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>AI Summary</span>
          </div>
          {activeTab === "summary" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[--color-brand-400] to-transparent"></div>
          )}
        </button>
        
        <button
          onClick={() => setActiveTab("transcript")}
          className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 relative ${
            activeTab === "transcript"
              ? "text-[--color-accent-cyan] bg-gradient-to-b from-[--color-accent-cyan]/10 to-transparent"
              : "text-[--color-muted] hover:text-[--color-foreground] hover:bg-white/5"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Live Transcript</span>
          </div>
          {activeTab === "transcript" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[--color-accent-cyan] to-transparent"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      <div className="h-[80vh] overflow-auto">
        {activeTab === "summary" ? (
          <div className="animate-fadeIn">{left}</div>
        ) : (
          <div className="animate-fadeIn">{right}</div>
        )}
      </div>
    </div>
  );
}


