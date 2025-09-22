"use client";

import { useAppState } from "@/lib/state";
import { Card, Button, Badge } from "@/components/ui";
import Link from "next/link";
import { useState, useMemo } from "react";
import { MOCK_FEED } from "@/lib/mock";

export default function AlertsPage() {
  const { state, setPreferences } = useAppState();
  const prefs = state.preferences;
  const [cadence, setCadence] = useState(prefs?.alertCadence || "Daily");
  const [threshold, setThreshold] = useState(prefs?.impactThreshold || "High");
  const [saving, setSaving] = useState(false);

  const recent = useMemo(() => {
    return MOCK_FEED.slice(0, 8);
  }, []);
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Alerts & Digests</h1>
      <p className="muted mt-1">Configure cadence and see recent alerts (mock).</p>

      <div className="mt-6 grid gap-6">
        <Card>
          <div className="font-medium">Settings</div>
          <div className="grid sm:grid-cols-3 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium">Cadence</label>
              <select value={cadence} onChange={(e) => setCadence(e.target.value as any)} className="input mt-2">
                <option className="bg-background" value="Off">Off</option>
                <option className="bg-background" value="Daily">Daily</option>
                <option className="bg-background" value="Weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Impact threshold</label>
              <select value={threshold} onChange={(e) => setThreshold(e.target.value as any)} className="input mt-2">
                <option className="bg-background" value="Low">Low</option>
                <option className="bg-background" value="Medium">Medium</option>
                <option className="bg-background" value="High">High</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                disabled={saving}
                className="w-full border border-[color-mix(in_oklab,var(--brand-300)_35%,transparent)]"
                onClick={async () => {
                  setSaving(true);
                  setPreferences({
                    workspaceName: prefs?.workspaceName || "My Workspace",
                    jurisdictions: prefs?.jurisdictions || [],
                    topics: prefs?.topics || [],
                    alertCadence: cadence as any,
                    impactThreshold: threshold as any,
                  });
                  setTimeout(() => setSaving(false), 300);
                }}
              >
                Save settings
              </Button>
            </div>
          </div>
        </Card>
        <Card>
          <div className="font-medium">Recent Digests</div>
          <div className="mt-3 rounded-[--radius-lg] border border-white/10 overflow-x-auto bg-white/5">
            <div className="min-w-[900px] grid grid-cols-12 bg-white/10 text-[13px] font-medium">
              <div className="col-span-5 px-3 py-2">Title</div>
              <div className="col-span-3 px-3 py-2">Entity / County</div>
              <div className="col-span-2 px-3 py-2">Docs</div>
              <div className="col-span-2 px-3 py-2">Impact</div>
            </div>
            {recent.map((item, idx) => (
              <div key={item.id} className={`min-w-[900px] grid grid-cols-12 border-t border-white/10 text-sm ${idx % 2 ? "bg-white/[0.03]" : ""}`}>
                <div className="col-span-5 px-3 py-3">
                  <Link href={`/item/${item.id}`} className="font-medium hover:underline text-[--color-brand-100]">{item.title}</Link>
                  <div className="text-xs muted mt-1">Hits: {Object.entries(item.hits).map(([k,v]) => `${k}(${v})`).join(", ")}</div>
                </div>
                <div className="col-span-3 px-3 py-3">
                  <div className="font-medium text-xs">{item.entity}</div>
                  <div className="text-xs muted">{item.jurisdiction}</div>
                </div>
                <div className="col-span-2 px-3 py-3 text-xs">{item.docTypes.join(", ")}</div>
                <div className="col-span-2 px-3 py-3"><Badge color={item.impact === "High" ? "danger" : item.impact === "Medium" ? "warning" : "success"}>{item.impact}</Badge></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}


