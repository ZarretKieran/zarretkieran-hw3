"use client";

import { useParams } from "next/navigation";
import { MOCK_FEED } from "@/lib/mock";
import { SplitViewer } from "@/components/SplitViewer";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { useAppState } from "@/lib/state";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const item = MOCK_FEED.find((x) => x.id === params.id);
  const { state, addToBrief, removeFromBrief } = useAppState();

  if (!item) {
    return (
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-sm">Item not found. <Link className="underline" href="/dashboard">Back to dashboard</Link></div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[--color-brand-100]">{item.title}</h1>
          <div className="text-sm muted mt-1">{item.entity} — {item.jurisdiction}</div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Follow</Button>
          {item && state.briefItemIds.includes(item.id) ? (
            <Button variant="ghost" onClick={() => removeFromBrief(item.id)}>Remove from Brief</Button>
          ) : (
            item ? <Button variant="ghost" onClick={() => addToBrief(item.id)}>Add to Brief</Button> : null
          )}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card>
          <div className="font-medium">Context</div>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="rounded-md border border-white/10 p-3 bg-white/5">
              <div className="text-xs uppercase tracking-wide text-[--color-muted]">Prior Actions — Sedgwick County</div>
              <div className="mt-1">Ordinance passed in 2022 related to utility-scale solar siting.</div>
            </div>
            <div className="rounded-md border border-white/10 p-3 bg-white/5">
              <div className="text-xs uppercase tracking-wide text-[--color-muted]">Related Jurisdictions — Douglas County</div>
              <div className="mt-1">Draft ordinance under review.</div>
            </div>
            <div className="rounded-md border border-white/10 p-3 bg-white/5">
              <div className="text-xs uppercase tracking-wide text-[--color-muted]">Related Jurisdictions — Wyandotte County</div>
              <div className="mt-1">Work session scheduled for next month.</div>
            </div>
            <div className="rounded-md border border-white/10 p-3 bg-white/5">
              <div className="text-xs uppercase tracking-wide text-[--color-muted]">Change Log</div>
              <div className="mt-1">Draft → Current: setback distance updated; added buffer definitions.</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="font-medium">Signals</div>
          <div className="mt-3 grid gap-2 text-sm">
            <div className="rounded-md border border-white/10 p-3 bg-white/5">
              <div className="text-xs uppercase tracking-wide text-[--color-muted]">Sentiment</div>
              <div className="mt-1">Public comments: neutral to mixed</div>
            </div>
            <div className="rounded-md border border-white/10 p-3 bg-white/5">
              <div className="text-xs uppercase tracking-wide text-[--color-muted]">Stage</div>
              <div className="mt-1">{item.stage || "Draft"}</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between mb-2">
          <div className="section-title">Document Viewer</div>
          <div className="text-xs muted">Left: extracted text · Right: live transcript loader</div>
        </div>
        <SplitViewer
          left={
            <div className="p-4 text-sm space-y-4">
              <div className="text-xs muted">Extracted text (mock) with keyword highlights</div>
              {(item.extractedText && item.extractedText.length > 0 ? item.extractedText : [
                "No extracted text available for this item.",
              ]).map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          }
          right={
            <div className="h-full overflow-auto p-4">
              <TranscriptViewer />
            </div>
          }
        />
      </div>
    </main>
  );
}


