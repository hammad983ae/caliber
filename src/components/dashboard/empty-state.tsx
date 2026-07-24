import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-3xl bg-white/70 px-6 py-16 text-center shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xl text-white shadow-sm shadow-indigo-500/30">
        +
      </span>
      <h2 className="mt-4 text-lg font-medium">No automations yet</h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
        Describe what you want to happen, and Caliber will turn it into your
        first automation.
      </p>
      <Link
        href="/dashboard/new"
        className="mt-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/30 transition-transform hover:scale-[1.03]"
      >
        Create your first automation
      </Link>
    </div>
  );
}
