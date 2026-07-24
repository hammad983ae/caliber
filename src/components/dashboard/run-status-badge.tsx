const styles = {
  success: { dot: "bg-emerald-500", label: "Success", text: "text-emerald-700 dark:text-emerald-300" },
  partial: { dot: "bg-amber-500", label: "Partial", text: "text-amber-700 dark:text-amber-300" },
  failed: { dot: "bg-rose-500", label: "Failed", text: "text-rose-700 dark:text-rose-300" },
} as const;

export function RunStatusBadge({ status }: { status: keyof typeof styles }) {
  const s = styles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
