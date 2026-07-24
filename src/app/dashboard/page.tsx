"use client";

import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { useAutomations } from "@/components/dashboard/automations-context";
import { AutomationCard } from "@/components/dashboard/automation-card";
import { EmptyState } from "@/components/dashboard/empty-state";

export default function DashboardPage() {
  const { automations } = useAutomations();
  const { organization } = useOrganization();

  const active = automations.filter((a) => a.status === "active").length;
  const needsAttention = automations.filter((a) => a.status === "error").length;
  const paused = automations.filter((a) => a.status === "paused").length;
  const pending = automations.filter((a) => a.status === "pending_approval").length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {organization ? `${organization.name} automations` : "Automations"}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {organization
              ? "Everything the team is running, shared and approved together."
              : "Everything Caliber is running on your behalf."}
          </p>
        </div>
        <Link
          href="/dashboard/new"
          className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/30 transition-transform hover:scale-[1.03]"
        >
          + New automation
        </Link>
      </div>

      {automations.length > 0 && (
        <div className={`mt-8 grid gap-4 ${pending > 0 ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
          <Stat label="Active" value={active} tone="text-emerald-600 dark:text-emerald-400" />
          <Stat label="Paused" value={paused} tone="text-amber-600 dark:text-amber-400" />
          <Stat
            label="Needs attention"
            value={needsAttention}
            tone="text-rose-600 dark:text-rose-400"
          />
          {pending > 0 && (
            <Stat
              label="Pending approval"
              value={pending}
              tone="text-indigo-600 dark:text-indigo-400"
            />
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {automations.length === 0 ? (
          <EmptyState />
        ) : (
          automations.map((automation) => (
            <AutomationCard key={automation.id} automation={automation} />
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl bg-white/70 px-5 py-4 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
      <p className={`text-2xl font-semibold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}
