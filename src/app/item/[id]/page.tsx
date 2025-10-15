"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { MOCK_FEED } from "@/lib/mock";
import { SplitViewer } from "@/components/SplitViewer";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { useAppState } from "@/lib/state";
import ReactMarkdown from "react-markdown";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const item = MOCK_FEED.find((x) => x.id === params.id);
  const { state, addToBrief, removeFromBrief } = useAppState();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  
  const userTopics = state.preferences?.topics || [];

  if (!item) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm">Item not found. <Link className="underline" href="/dashboard">Back to dashboard</Link></div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with enhanced visual hierarchy */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="page-title mb-2">{item.title}</h1>
            <div className="subtitle flex items-center gap-2">
              <span className="text-[--color-brand-300] font-semibold">{item.entity}</span>
              <span className="text-[--color-muted]/50">•</span>
              <span>{item.jurisdiction}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button variant="secondary">Follow</Button>
            {item && state.briefItemIds.includes(item.id) ? (
              <Button variant="primary" onClick={() => removeFromBrief(item.id)}>Remove from Brief</Button>
            ) : (
              item ? <Button variant="primary" onClick={() => addToBrief(item.id)}>Add to Brief</Button> : null
            )}
          </div>
        </div>
      </div>

      {/* Document Viewer Section */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4 pb-3 accent-border-top pt-4">
          <div>
            <div className="section-title">Document Viewer</div>
            <div className="text-xs text-[--color-muted] mt-1">AI-powered analysis and transcript loading</div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-[--color-brand-500]/10 text-[--color-brand-200] border border-[--color-brand-500]/20">AI Summary</span>
            <span className="text-xs px-2 py-1 rounded-md bg-[--color-accent-cyan]/10 text-cyan-300 border border-[--color-accent-cyan]/20">Live Transcript</span>
          </div>
        </div>
        <SplitViewer
          left={
            <div className="p-6 text-sm space-y-4">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-[--color-brand-400] animate-pulse"></div>
                <div className="text-xs uppercase tracking-wider font-bold text-[--color-brand-200]">AI-Generated Summary</div>
              </div>
              {aiSummary ? (
                <div className="prose prose-sm prose-invert max-w-none markdown-content">
                  <ReactMarkdown
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-lg font-bold mt-4 mb-2 text-[--color-brand-100]" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-base font-semibold mt-3 mb-2 text-[--color-brand-200]" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-sm font-semibold mt-2 mb-1 text-[--color-brand-300]" {...props} />,
                      p: ({node, ...props}) => <p className="mb-3 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-3 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-3 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="ml-2" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-semibold text-[--color-brand-100]" {...props} />,
                      em: ({node, ...props}) => <em className="italic text-[--color-muted]" {...props} />,
                      code: ({node, ...props}) => <code className="bg-white/10 px-1 py-0.5 rounded text-xs" {...props} />,
                    }}
                  >
                    {aiSummary}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="rounded-lg border-2 border-dashed border-[--color-brand-500]/20 bg-[--color-brand-500]/5 p-6 text-center">
                  <div className="text-[--color-muted] mb-3">
                    <svg className="w-12 h-12 mx-auto mb-3 text-[--color-brand-400]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">Load a transcript to generate an AI summary with key takeaways, talking points, and relevance to your topics.</p>
                  </div>
                  {userTopics.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="text-xs uppercase tracking-wide text-[--color-brand-300] mb-2 font-semibold">Your Topics</div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {userTopics.map((topic, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded-full bg-[--color-brand-500]/20 text-[--color-brand-100] border border-[--color-brand-500]/30">
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          }
          right={
            <div className="h-full overflow-auto p-6 bg-gradient-to-br from-[--color-surface] to-[--color-surface-2]">
              <TranscriptViewer 
                onSummaryGenerated={setAiSummary}
                userTopics={userTopics}
              />
            </div>
          }
        />
      </div>
    </main>
  );
}


