"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppState } from "@/lib/state";
import type { ImpactLevel, UserPreferences } from "@/lib/types";
import { Button, Card } from "@/components/ui";
import { Badge } from "@/components/ui";
import { MOCK_FEED } from "@/lib/mock";

const counties = [
  "Johnson",
  "Sedgwick",
  "Douglas",
  "Wyandotte",
  "Shawnee",
  "Leavenworth",
  "Miami",
  "Riley",
  "Harvey",
  "Butler",
];
const topicSuggestions = [
  "cell phone ban",
  "curriculum",
  "book policy",
  "solar zoning",
  "renewable incentive",
  "land use",
  "transit",
  "bike lanes",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setPreferences } = useAppState();
  const [workspaceName, setWorkspaceName] = useState("State Desk");
  const [jurisdictions, setJurisdictions] = useState<string[]>(["Johnson", "Sedgwick"]);
  const [topics, setTopics] = useState<string[]>(["cell phone ban", "solar zoning"]);
  const [alertCadence, setAlertCadence] = useState<UserPreferences["alertCadence"]>("Daily");
  const [impactThreshold, setImpactThreshold] = useState<ImpactLevel>("High");
  const [jurisdictionSearch, setJurisdictionSearch] = useState("");
  const [customTopic, setCustomTopic] = useState("");

  function toggle<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPreferences({ workspaceName, jurisdictions, topics, alertCadence, impactThreshold });
    router.push("/dashboard");
  }

  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-semibold tracking-tight bg-gradient-to-b from-[--color-brand-100] to-[--color-brand-300] bg-clip-text text-transparent">Create your workspace</h1>
      <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
        <Card>
          <label className="block text-sm font-medium">Workspace name</label>
          <input value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)} className="input mt-2" />
        </Card>
        <Card>
          <div className="flex items-baseline justify-between">
            <label className="block text-sm font-medium">Jurisdictions</label>
            <span className="text-xs muted">Select counties</span>
          </div>
          <div className="mt-3">
            <input
              className="input"
              placeholder="Search counties..."
              value={jurisdictionSearch}
              onChange={(e) => setJurisdictionSearch(e.target.value)}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {counties.filter((c) => c.toLowerCase().includes(jurisdictionSearch.toLowerCase())).map((c) => {
              const active = jurisdictions.includes(c);
              return (
                <button
                  type="button"
                  aria-pressed={active}
                  key={c}
                  onClick={() => setJurisdictions((j) => toggle(j, c))}
                  className="chip"
                >
                  {c}
                </button>
              );
            })}
          </div>
        </Card>
        <Card>
          <div className="flex items-baseline justify-between">
            <label className="block text-sm font-medium">Topics / Keywords</label>
            <span className="text-xs muted">Typeahead + chips (mock)</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input
              className="input flex-1"
              placeholder="Add a custom topic/keyword and press Add or Enter"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const v = customTopic.trim();
                  if (v && !topics.includes(v)) {
                    setTopics((x) => [...x, v]);
                    setCustomTopic("");
                  }
                }
              }}
            />
            <button
              type="button"
              className="chip"
              onClick={() => {
                const v = customTopic.trim();
                if (v && !topics.includes(v)) {
                  setTopics((x) => [...x, v]);
                  setCustomTopic("");
                }
              }}
            >
              Add
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {topicSuggestions.map((t) => {
              const active = topics.includes(t);
              return (
                <button
                  type="button"
                  aria-pressed={active}
                  key={t}
                  onClick={() => setTopics((x) => toggle(x, t))}
                  className="chip"
                >
                  {t}
                </button>
              );
            })}
          </div>
          {topics.filter((t) => !topicSuggestions.includes(t)).length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {topics.filter((t) => !topicSuggestions.includes(t)).map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={true}
                  className="chip"
                  onClick={() => setTopics((x) => x.filter((y) => y !== t))}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </Card>
        <div className="grid sm:grid-cols-2 gap-6">
          <Card>
            <label className="block text-sm font-medium">Alert cadence</label>
            <select value={alertCadence} onChange={(e) => setAlertCadence(e.target.value as UserPreferences["alertCadence"])} className="input mt-2">
              <option className="bg-background" value="Off">Off</option>
              <option className="bg-background" value="Daily">Daily</option>
              <option className="bg-background" value="Weekly">Weekly</option>
            </select>
          </Card>
          <Card>
            <label className="block text-sm font-medium">Impact threshold</label>
            <select value={impactThreshold} onChange={(e) => setImpactThreshold(e.target.value as ImpactLevel)} className="input mt-2">
              <option className="bg-background" value="Low">Low</option>
              <option className="bg-background" value="Medium">Medium</option>
              <option className="bg-background" value="High">High</option>
            </select>
          </Card>
        </div>
        <div className="pt-2">
          <Button
            type="submit"
            className="border border-[color-mix(in_oklab,var(--brand-300)_35%,transparent)] hover:shadow-md hover:-translate-y-[1px]"
          >
            Save and continue
          </Button>
        </div>
      </form>
      
    </main>
  );
}


