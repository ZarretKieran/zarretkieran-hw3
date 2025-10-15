"use client";

import { forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }>(
  function Button({ className = "", variant = "primary", ...props }, ref) {
    const base = "inline-flex items-center justify-center rounded-lg text-sm font-medium px-4 py-2.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[--color-background] focus-visible:ring-[--ring-color] disabled:opacity-50 disabled:cursor-not-allowed";
    const styles =
      variant === "primary"
        ? "bg-gradient-to-br from-[--color-brand-500] to-[--color-brand-600] hover:from-[--color-brand-400] hover:to-[--color-brand-500] text-white shadow-[--shadow-button] hover:shadow-[--shadow-button-hover] hover:-translate-y-0.5 active:translate-y-0 border border-[color-mix(in_oklab,var(--brand-400)_40%,transparent)]"
        : variant === "secondary"
        ? "border-2 border-[--color-brand-400]/30 bg-[--color-surface-elevated] hover:bg-[--color-brand-500]/10 hover:border-[--color-brand-400]/50 text-[--color-brand-100] shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        : "hover:bg-white/10 text-[--color-muted] hover:text-[--color-foreground]";
    return <button ref={ref} className={`${base} ${styles} ${className}`} {...props} />;
  }
);

export function LinkButton({ href, children, variant = "primary", className = "" }: { href: string; children: React.ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  const base = "inline-flex items-center justify-center rounded-lg text-sm px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--ring-color] shadow-sm hover:shadow-md hover:-translate-y-[1px]";
  const styles =
    variant === "primary"
      ? "bg-[--color-brand-600] hover:bg-[--color-brand-500] text-white border border-[color-mix(in_oklab,var(--brand-300)_35%,transparent)]"
      : variant === "secondary"
      ? "border border-white/20 bg-surface/60 hover:bg-white/10"
      : "hover:bg-white/10";
  return (
    <a href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </a>
  );
}

export function Badge({ children, color = "brand" as "brand" | "success" | "warning" | "danger" }: { children: React.ReactNode; color?: "brand" | "success" | "warning" | "danger" }) {
  const colors: Record<string, string> = {
    brand: "bg-[color-mix(in_oklab,var(--brand-500)_15%,transparent)] text-[--color-brand-200] border-[color-mix(in_oklab,var(--brand-500)_30%,transparent)]",
    success: "bg-[color-mix(in_oklab,var(--success)_15%,transparent)] text-emerald-200 border-[color-mix(in_oklab,var(--success)_30%,transparent)]",
    warning: "bg-[color-mix(in_oklab,var(--warning)_15%,transparent)] text-amber-200 border-[color-mix(in_oklab,var(--warning)_30%,transparent)]",
    danger: "bg-[color-mix(in_oklab,var(--danger)_15%,transparent)] text-red-200 border-[color-mix(in_oklab,var(--danger)_30%,transparent)]",
  };
  return <span className={`px-2 py-1 rounded-md text-xs border ${colors[color]}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-4 ${className}`}>{children}</div>;
}

export function Section({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div className="section-title">{title}</div>
        {right}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}


