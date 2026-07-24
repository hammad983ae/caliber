export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
      <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
      {label}
      <span className="h-px flex-1 bg-black/[.08] dark:bg-white/[.145]" />
    </div>
  );
}
