"use client";

import { useAppState } from "@/lib/state";
import { MOCK_FEED } from "@/lib/mock";
import { Button, Card } from "@/components/ui";
import Link from "next/link";

export default function BriefPage() {
  const { state, removeFromBrief } = useAppState();
  const items = MOCK_FEED.filter((x) => state.briefItemIds.includes(x.id));
  const itemCount = items.length;
  const allCounties = Array.from(new Set(items.flatMap((i) => i.counties))).sort();
  const dates = items.map((i) => new Date(i.meetingDate).getTime()).sort((a, b) => a - b);
  const dateRange = dates.length
    ? `${new Date(dates[0]).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })} → ${new Date(
        dates[dates.length - 1]
      ).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
    : "—";
  const docTypes = Array.from(new Set(items.flatMap((i) => i.docTypes))).sort();
  const impacts = items.reduce(
    (acc, i) => ({ ...acc, [i.impact]: (acc[i.impact as keyof typeof acc] || 0) + 1 }),
    { High: 0, Medium: 0, Low: 0 } as Record<"High" | "Medium" | "Low", number>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Brief Builder</h1>
      

      <section className="mt-6 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="min-h-[200px]">
            {items.length === 0 ? (
              <div className="text-sm muted">No items in your brief yet.</div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg border border-white/10 bg-surface/60">
                    <Link href={`/item/${item.id}`} className="font-medium hover:underline text-[--color-brand-100]">
                      {item.title}
                    </Link>
                    <div className="text-xs muted">{item.entity} — {item.jurisdiction}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="secondary" onClick={() => removeFromBrief(item.id)}>Remove</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
        <aside className="space-y-6">
          <Card>
            <div className="font-medium">Brief Metadata</div>
            <div className="mt-3 grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[--color-muted]">Items</span>
                <span className="font-medium">{itemCount}</span>
              </div>
              <div>
                <div className="text-[--color-muted]">Counties</div>
                <div className="mt-1 text-xs">{allCounties.length ? allCounties.join(", ") : "—"}</div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[--color-muted]">Date range</span>
                <span className="text-xs">{dateRange}</span>
              </div>
              <div>
                <div className="text-[--color-muted]">Doc types</div>
                <div className="mt-1 text-xs">{docTypes.length ? docTypes.join(", ") : "—"}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <div className="rounded-md border border-white/10 bg-white/5 p-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-[--color-muted]">High</div>
                  <div className="text-sm font-medium">{impacts.High}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-[--color-muted]">Med</div>
                  <div className="text-sm font-medium">{impacts.Medium}</div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-2 text-center">
                  <div className="text-[10px] uppercase tracking-wider text-[--color-muted]">Low</div>
                  <div className="text-sm font-medium">{impacts.Low}</div>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div className="font-medium">Export</div>
            <div className="mt-3 grid gap-2">
              <Button variant="secondary">Export as PDF (mock)</Button>
              <Button variant="secondary">Export to Google Doc (mock)</Button>
              <Button variant="secondary">Share link (mock)</Button>
            </div>
          </Card>
        </aside>
      </section>
    </main>
  );
}


