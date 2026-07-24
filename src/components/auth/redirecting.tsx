import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export function Redirecting({ notice }: { notice: string | null }) {
  return (
    <AuthShell
      title={notice ? "One more thing" : "Signing you in"}
      subtitle={notice ?? "Just a moment…"}
    >
      {notice ? (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-red-600 dark:text-red-400">{notice}</p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-foreground px-4 py-2.5 text-center text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
          >
            Try the dashboard anyway
          </Link>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-4">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-black/10 border-t-foreground dark:border-white/10" />
          <Link
            href="/dashboard"
            className="text-sm text-zinc-500 underline underline-offset-4 hover:text-foreground dark:text-zinc-400"
          >
            Taking a while? Go to the dashboard
          </Link>
        </div>
      )}
    </AuthShell>
  );
}
