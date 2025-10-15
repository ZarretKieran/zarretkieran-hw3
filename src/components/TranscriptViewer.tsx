"use client";

import { useState } from "react";
import { Button } from "./ui";

interface TranscriptData {
  title: string;
  date: string;
  speakers: string[];
  content: string[];
}

interface TranscriptViewerProps {
  onSummaryGenerated?: (summary: string) => void;
  userTopics?: string[];
}

export function TranscriptViewer({ onSummaryGenerated, userTopics }: TranscriptViewerProps) {
  const [url, setUrl] = useState("");
  const [transcript, setTranscript] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const handleFetchTranscript = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("/api/fetch-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transcript");
      }

      const data = await response.json();
      setTranscript(data.transcript);
      
      // Generate AI summary after transcript is loaded
      if (data.transcript && onSummaryGenerated) {
        await generateSummary(data.transcript.content);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setTranscript(null);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async (transcriptContent: string[]) => {
    if (!onSummaryGenerated) return;
    
    setGeneratingSummary(true);
    try {
      const response = await fetch("/api/summarize-transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          transcriptContent,
          userTopics: userTopics || []
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      onSummaryGenerated(data.summary);
    } catch (err) {
      console.error("Summary generation error:", err);
      onSummaryGenerated("Failed to generate summary. Please try again.");
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleClear = () => {
    setUrl("");
    setTranscript(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      {/* URL Input Section */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <label className="block text-sm font-medium mb-2">
          Municipal Transcript URL (temporary - no DB implemented yet)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://watertown.munitrac.ai/transcript?id=..."
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[--color-brand-100]"
            disabled={loading}
          />
          <Button 
            onClick={handleFetchTranscript} 
            disabled={loading || generatingSummary || !url.trim()}
            variant="secondary"
          >
            {loading ? "Loading..." : generatingSummary ? "Generating Summary..." : "Load Transcript"}
          </Button>
          {transcript && (
            <Button onClick={handleClear} variant="ghost">
              Clear
            </Button>
          )}
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="space-y-4">
          {/* Header Info */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold text-[--color-brand-100]">
              {transcript.title}
            </h3>
            {transcript.date && (
              <p className="text-sm text-[--color-muted] mt-1">
                {transcript.date}
              </p>
            )}
            {transcript.speakers.length > 0 && (
              <div className="mt-3">
                <p className="text-xs uppercase tracking-wide text-[--color-muted] mb-1">
                  Speakers
                </p>
                <div className="flex flex-wrap gap-2">
                  {transcript.speakers.map((speaker, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded bg-white/10 border border-white/10"
                    >
                      {speaker}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Transcript Content */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-4">
            <h4 className="text-sm font-medium mb-3">Transcript</h4>
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {transcript.content.map((line, idx) => (
                <p key={idx} className="text-sm leading-relaxed">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!transcript && !loading && !error && (
        <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-[--color-muted]">
            Enter a municipal transcript URL above to load and view the content
          </p>
          <p className="text-xs text-[--color-muted] mt-2">
            Example: https://watertown.munitrac.ai/transcript?id=2025-10-07_TownMeeting-0u699.mp4
          </p>
        </div>
      )}
    </div>
  );
}
