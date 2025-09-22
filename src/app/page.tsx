import { Card, LinkButton } from "@/components/ui";

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-16">
      <section className="text-center">
        <h1 className="text-[56px] sm:text-[80px] md:text-[96px] headline bg-gradient-to-b from-[--color-brand-100] to-[--color-brand-300] bg-clip-text text-transparent">
          The municipal intelligence layer
        </h1>
        <h2 className="mt-4 text-[28px] sm:text-[40px] font-semibold tracking-tight text-[--color-brand-100]">
          Surface local policy trends before they make headlines.
        </h2>
        <p className="mt-6 subheadline max-w-3xl mx-auto">
          CivicPulse turns scattered agendas and minutes into clear, searchable signals across jurisdictions—so you can move fast, brief stakeholders, and never miss what matters.
        </p>
        <div className="mt-10 flex items-center justify-center gap-3">
          <LinkButton href="/onboarding">Create your workspace</LinkButton>
          <LinkButton href="/dashboard" variant="secondary">Explore the prototype</LinkButton>
        </div>
        <div className="mt-10 flex items-center justify-center gap-6 text-xs text-[--color-muted]">
          <span>Trusted by reporters and policy teams</span>
          <span>•</span>
          <span>Built for speed and clarity</span>
        </div>
      </section>

      <section className="mt-20 grid sm:grid-cols-3 gap-6">
        <Card>
          <div className="section-title-accent mb-2" />
          <FeatureCard icon="📈" title="Trends Dashboard" desc="Heatmaps and timelines reveal where topics emerge and evolve." />
        </Card>
        <Card>
          <div className="section-title-accent mb-2" />
          <FeatureCard icon="🔎" title="Search & Compare" desc="Search by keyword, geography, and time; triage results in seconds." />
        </Card>
        <Card>
          <div className="section-title-accent mb-2" />
          <FeatureCard icon="🧩" title="Brief Builder" desc="Assemble concise briefs with citations and export/share in one click." />
        </Card>
      </section>

      <section className="mt-12 grid sm:grid-cols-3 gap-4">
        <Stat title="Coverage" value=">= 90%" hint="Within 24h of posting" />
        <Stat title="Search Accuracy" value=">= 0.80 F1" hint="Across top keywords" />
        <Stat title="Ingestion Lag" value="< 6 hours" hint="Median time to availability" />
      </section>

      <section className="mt-16">
        <div className="relative overflow-hidden rounded-[--radius-lg] border border-white/10 bg-surface/60 p-10 sm:p-14">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(600px 200px at 10% 0%, color-mix(in oklab, var(--brand-500) 20%, transparent) 0%, transparent 60%)" }} />
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[--color-brand-100]">Stop digging through PDFs. Start seeing patterns.</h2>
            <p className="text-base sm:text-lg text-[--color-muted] max-w-2xl">Create your workspace, pick jurisdictions and topics, and let CivicPulse surface the signals that matter to you.</p>
            <div className="flex items-center gap-3">
              <LinkButton href="/onboarding">Get started</LinkButton>
              <LinkButton href="/search" variant="secondary">Run a search</LinkButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, desc }: { icon?: string; title: string; desc: string }) {
  return (
    <div>
      {icon && <div className="text-2xl mb-2">{icon}</div>}
      <h3 className="font-medium text-[--color-brand-100]">{title}</h3>
      <p className="text-sm mt-2 text-[--color-muted]">{desc}</p>
    </div>
  );
}

function Stat({ title, value, hint }: { title: string; value: string; hint: string }) {
  return (
    <div className="rounded-[--radius-lg] border border-white/10 bg-surface/60 p-4 text-center">
      <div className="text-[10px] uppercase tracking-widest text-[--color-muted]">{title}</div>
      <div className="mt-1 text-2xl font-semibold text-[--color-brand-100]">{value}</div>
      <div className="mt-1 text-xs text-[--color-muted]">{hint}</div>
    </div>
  );
}
