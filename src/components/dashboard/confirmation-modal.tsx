"use client";

import { useState } from "react";
import type { FlowStep } from "@/lib/automations";
import { FlowPanel } from "@/components/dashboard/flow-panel";

export function ConfirmationModal({
  automationName,
  steps,
  onConfirm,
  onCancel,
}: {
  automationName: string;
  steps: FlowStep[];
  onConfirm: (alwaysAllow: boolean) => void;
  onCancel: () => void;
}) {
  const [alwaysAllow, setAlwaysAllow] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white p-6 shadow-2xl dark:bg-zinc-900"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
          Needs your confirmation
        </span>
        <h2 className="mt-3 text-lg font-semibold tracking-tight">
          Run &ldquo;{automationName}&rdquo; exactly as shown?
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          This automation includes at least one step that&apos;s hard to
          reverse. Review it before it&apos;s allowed to run.
        </p>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
          <FlowPanel steps={steps} />
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
          <input
            type="checkbox"
            checked={alwaysAllow}
            onChange={(e) => setAlwaysAllow(e.target.checked)}
            className="h-4 w-4 rounded border-black/20 text-indigo-600 focus:ring-indigo-500 dark:border-white/20"
          />
          Always allow this automation without asking again
        </label>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-full bg-black/[.04] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/[.1]"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(alwaysAllow)}
            className="rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-indigo-500/30 transition-transform hover:scale-[1.03]"
          >
            Confirm & run
          </button>
        </div>
      </div>
    </div>
  );
}
