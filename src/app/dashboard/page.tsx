"use client";

import Link from "next/link";
import { useAppState } from "@/lib/state";
import { MOCK_FEED } from "@/lib/mock";
import { Badge, Button, Section } from "@/components/ui";

export default function DashboardPage() {
  const { state, addToBrief } = useAppState();
  const prefs = state.preferences;
  const feed = MOCK_FEED;

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{prefs?.workspaceName || "Your Dashboard"}</h1>
          <p className="muted mt-1">Jurisdictions: {prefs?.jurisdictions.join(", ") || "None"} · Topics: {prefs?.topics.join(", ") || "None"}</p>
        </div>
        <Link href="/onboarding"><Button variant="secondary">Edit preferences</Button></Link>
      </div>

      <section className="mt-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Section title="Watchlist Feed">
            <div className="divide-y divide-white/10">
              {feed.map((item) => (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <div className="text-sm muted">{item.entity} — <span className="font-medium text-[--color-brand-100]">{item.jurisdiction}</span></div>
                    <Link href={`/item/${item.id}`} className="block font-medium mt-1 hover:underline text-[--color-brand-100]">{item.title}</Link>
                    <div className="mt-1 text-xs muted">Hits: {Object.entries(item.hits).map(([k,v]) => `${k}(${v})`).join(", ")} · {item.docTypes.join(", ")}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ImpactBadge level={item.impact} />
                    <Link href={`/item/${item.id}`}><Button variant="secondary">Open</Button></Link>
                    {state.briefItemIds.includes(item.id) ? (
                      <Button variant="ghost" disabled>In Brief</Button>
                    ) : (
                      <Button variant="ghost" onClick={() => addToBrief(item.id)}>Add to Brief</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Upcoming Meetings">
            <Placeholder height={140} label="Calendar/list of meetings (mock)" />
          </Section>

          <Section title="Documents Ingested">
            <Placeholder height={120} label="PDFs with OCR status (mock)" />
          </Section>
        </div>
        <div className="space-y-4">
          <Section title="Trend Heatmap">
            <HeatmapMock selectedCounties={prefs?.jurisdictions || []} selectedTopics={prefs?.topics || []} />
          </Section>
          <Section title="Topic Timeline (30/90 days)">
            <TopicTimelineMock selectedTopics={prefs?.topics || []} />
          </Section>
          <Section title="High Impact Items">
            <div className="grid gap-2 max-h-80 overflow-auto pr-1">
              {feed.filter((f) => f.impact === "High").map((item) => (
                <div key={item.id} className="p-3 rounded-lg border border-white/10 bg-surface/60 text-sm overflow-hidden">
                  <div className="flex items-center justify-between min-w-0">
                    <div className="font-medium truncate mr-2">{item.title}</div>
                    <div className="shrink-0"><ImpactBadge level={item.impact} /></div>
                  </div>
                  <div className="text-xs muted mt-1 truncate">{item.entity} — {item.jurisdiction}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>
    </main>
  );
}

function ImpactBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  if (level === "High") return <Badge color="danger">High Impact</Badge>;
  if (level === "Medium") return <Badge color="warning">Medium</Badge>;
  return <Badge color="success">Low</Badge>;
}

function Placeholder({ height, label }: { height: number; label: string }) {
  return (
    <div className="w-full rounded-lg border border-dashed border-white/20 grid place-items-center text-xs muted" style={{ height }}>
      {label}
    </div>
  );
}

function HeatmapMock({ selectedCounties, selectedTopics }: { selectedCounties: string[]; selectedTopics: string[] }) {
  const all = Array.from(new Set(["Johnson","Sedgwick","Douglas","Wyandotte","Shawnee","Leavenworth","Miami","Riley","Harvey","Butler"]));
  function weight(name: string) {
    const base = (name.length + selectedTopics.join("").length + selectedCounties.join("").length) % 10;
    return base / 10; // 0..1
  }
  return (
    <div className="mt-2 grid grid-cols-5 gap-2">
      {all.map((c) => {
        const w = weight(c);
        const isSelected = selectedCounties.includes(c);
        return (
          <div key={c} className="aspect-square rounded-md border border-white/10 grid place-items-center text-[10px]"
            style={{
              background: `color-mix(in oklab, var(--brand-600) ${Math.round(20 + w * 50)}%, transparent)`,
              outline: isSelected ? `2px solid var(--brand-300)` : undefined,
            }}
            title={`${c}`}
          >
            {c.slice(0,3)}
          </div>
        );
      })}
    </div>
  );
}

function TopicTimelineMock({ selectedTopics }: { selectedTopics: string[] }) {
  const bars = Array.from({ length: 12 }).map((_, i) => {
    const v = ((i * 7 + selectedTopics.join("").length) % 10) + 2; // 2..11
    return v;
  });
  return (
    <div className="mt-2 h-40 flex items-end gap-2">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-[color-mix(in_oklab,var(--brand-500)_60%,transparent)]" style={{ height: `${(h/12)*100}%` }} />
      ))}
    </div>
  );
}


