"use client";

import { useState } from "react";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import type { Automation } from "@/lib/automations";
import { ConnectorIcon } from "@/components/icons/connector-icon";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { ToggleSwitch } from "@/components/dashboard/toggle-switch";
import { ConfirmationModal } from "@/components/dashboard/confirmation-modal";
import { useAutomations } from "@/components/dashboard/automations-context";
import { runCalendarAutomation } from "@/app/dashboard/actions";

const outcomeColor: Record<NonNullable<Automation["lastRun"]>["outcome"], string> = {
  success: "text-emerald-600 dark:text-emerald-400",
  partial: "text-amber-600 dark:text-amber-400",
  failed: "text-rose-600 dark:text-rose-400",
};

export function AutomationCard({
  automation,
  googleCalendarConnected = false,
}: {
  automation: Automation;
  googleCalendarConnected?: boolean;
}) {
  const { toggleStatus, approveAutomation, rejectAutomation, setAlwaysAllow } = useAutomations();
  const { membership } = useOrganization();
  const isAdmin = membership?.role === "org:admin";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [running, setRunning] = useState(false);
  const [runResult, setRunResult] = useState<{ ok: boolean; message: string; link?: string } | null>(
    null,
  );

  const hasConfirmRisk = automation.steps.some((s) => s.risk === "confirm");
  const canRunOnCalendar =
    automation.status === "active" &&
    automation.connectors.includes("calendar") &&
    googleCalendarConnected;

  const handleToggle = () => {
    const turningOn = automation.status !== "active";
    if (turningOn && hasConfirmRisk && !automation.alwaysAllow) {
      setConfirmOpen(true);
      return;
    }
    toggleStatus(automation.id);
  };

  const handleRunNow = async () => {
    setRunning(true);
    setRunResult(null);
    const result = await runCalendarAutomation(automation.name);
    setRunning(false);
    setRunResult(
      result.ok
        ? { ok: true, message: "Created a real event on your calendar.", link: result.link }
        : { ok: false, message: result.error },
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-shadow hover:shadow-md dark:bg-white/[0.03] dark:ring-white/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="truncate text-base font-medium">{automation.name}</h3>
            <StatusBadge status={automation.status} />
          </div>

          <div className="mt-2 flex items-center gap-1.5">
            {automation.connectors.map((icon) => (
              <span
                key={icon}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-300"
              >
                <ConnectorIcon icon={icon} className="h-3.5 w-3.5" />
              </span>
            ))}
          </div>

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {automation.status === "pending_approval" ? (
              automation.createdBy ? (
                `Proposed by ${automation.createdBy.name}`
              ) : (
                "Waiting for approval"
              )
            ) : automation.lastRun ? (
              <>
                Last run {automation.lastRun.at} —{" "}
                <span className={outcomeColor[automation.lastRun.outcome]}>
                  {automation.lastRun.detail}
                </span>
              </>
            ) : (
              "Never run yet"
            )}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end sm:gap-3">
          {automation.status === "pending_approval" ? (
            isAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={() => rejectAutomation(automation.id)}
                  className="rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/[.1]"
                >
                  Reject
                </button>
                <button
                  onClick={() => approveAutomation(automation.id)}
                  className="rounded-full bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Approve
                </button>
              </div>
            ) : (
              <span className="text-xs text-zinc-400 dark:text-zinc-500">
                Needs admin approval
              </span>
            )
          ) : automation.status === "active" || automation.status === "paused" ? (
            <ToggleSwitch
              on={automation.status === "active"}
              onChange={handleToggle}
              label={`Toggle ${automation.name}`}
            />
          ) : automation.status === "error" ? (
            <Link
              href="/dashboard/settings"
              className="text-sm font-medium text-rose-700 hover:underline dark:text-rose-300"
            >
              Reconnect
            </Link>
          ) : (
            <Link
              href="/dashboard/new"
              className="text-sm font-medium text-indigo-700 hover:underline dark:text-indigo-300"
            >
              Finish setup
            </Link>
          )}
        </div>
      </div>

      {canRunOnCalendar && (
        <div className="flex flex-col gap-2 border-t border-black/5 pt-4 dark:border-white/10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Includes a real Google Calendar step — run it for real right now.
            </p>
            <button
              onClick={handleRunNow}
              disabled={running}
              className="shrink-0 rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.07] disabled:opacity-50 dark:bg-white/[.06] dark:hover:bg-white/[.1]"
            >
              {running ? "Running…" : "Run now"}
            </button>
          </div>
          {runResult && (
            <p
              className={`text-sm ${runResult.ok ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
            >
              {runResult.message}{" "}
              {runResult.link && (
                <a href={runResult.link} target="_blank" rel="noreferrer" className="underline">
                  View on Google Calendar
                </a>
              )}
            </p>
          )}
        </div>
      )}

      {confirmOpen && (
        <ConfirmationModal
          automationName={automation.name}
          steps={automation.steps}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={(alwaysAllow) => {
            setConfirmOpen(false);
            if (alwaysAllow) setAlwaysAllow(automation.id, true);
            toggleStatus(automation.id);
          }}
        />
      )}
    </div>
  );
}
