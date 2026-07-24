"use client";

import { useMemo, useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { useActivity } from "@/components/dashboard/activity-context";
import { ConnectorIcon } from "@/components/icons/connector-icon";
import { RunStatusBadge } from "@/components/dashboard/run-status-badge";

const STATUS_FILTERS = ["all", "success", "partial", "failed"] as const;

export default function ActivityPage() {
  const { entries, undoEntry } = useActivity();
  const { organization } = useOrganization();
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>("all");
  const [connector, setConnector] = useState<string>("all");

  const connectors = useMemo(
    () => Array.from(new Set(entries.flatMap((e) => e.connectors))),
    [entries],
  );

  const filtered = entries.filter(
    (e) =>
      (status === "all" || e.status === status) &&
      (connector === "all" || e.connectors.includes(connector)),
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {organization
          ? `Everything ${organization.name} has run.`
          : "Everything Caliber has run on your behalf."}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="flex gap-1 rounded-full bg-black/[.04] p-1 dark:bg-white/[.06]">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                status === s
                  ? "bg-white text-foreground shadow-sm dark:bg-white/10"
                  : "text-zinc-600 hover:text-foreground dark:text-zinc-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {connectors.length > 0 && (
          <select
            value={connector}
            onChange={(e) => setConnector(e.target.value)}
            className="rounded-full bg-black/[.04] px-3 py-1.5 text-xs font-medium capitalize outline-none dark:bg-white/[.06]"
          >
            <option value="all">All apps</option>
            {connectors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-white/70 px-6 py-16 text-center shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {entries.length === 0
                ? "Nothing has run yet — it'll show up here once an automation fires."
                : "No activity matches those filters."}
            </p>
          </div>
        ) : (
          filtered.map((entry) => (
            <div
              key={entry.id}
              className="flex flex-col gap-3 rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="flex -space-x-1.5">
                  {entry.connectors.map((icon) => (
                    <span
                      key={icon}
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 ring-2 ring-white dark:text-indigo-300 dark:ring-black"
                    >
                      <ConnectorIcon icon={icon} className="h-3.5 w-3.5" />
                    </span>
                  ))}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{entry.automationName}</p>
                    <RunStatusBadge status={entry.status} />
                  </div>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{entry.summary}</p>
                  <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                    {entry.at}
                    {entry.ranBy && ` · Ran by ${entry.ranBy.name}`}
                  </p>
                </div>
              </div>

              {entry.undoable && (
                <button
                  onClick={() => undoEntry(entry.id)}
                  className="shrink-0 self-start rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/[.1] sm:self-center"
                >
                  Undo
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
