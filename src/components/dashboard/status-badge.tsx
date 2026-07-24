import type { AutomationStatus } from "@/lib/automations";

const styles: Record<AutomationStatus, { dot: string; label: string; text: string }> = {
  active: {
    dot: "bg-emerald-500",
    label: "Active",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  paused: {
    dot: "bg-amber-500",
    label: "Paused",
    text: "text-amber-700 dark:text-amber-300",
  },
  error: {
    dot: "bg-rose-500",
    label: "Needs attention",
    text: "text-rose-700 dark:text-rose-300",
  },
  draft: {
    dot: "bg-zinc-400",
    label: "Draft",
    text: "text-zinc-600 dark:text-zinc-400",
  },
  pending_approval: {
    dot: "bg-indigo-500",
    label: "Pending approval",
    text: "text-indigo-700 dark:text-indigo-300",
  },
};

export function StatusBadge({ status }: { status: AutomationStatus }) {
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
