import Link from "next/link";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
      <span className="rounded-full border border-black/[.08] px-3 py-1 text-xs font-medium text-zinc-600 dark:border-white/[.145] dark:text-zinc-400">
        Say it. Confirm it. It runs.
      </span>

      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        Turn what you say into automation that actually happens.
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
        Speak or type what you want done. Caliber figures out the automation,
        shows you exactly what it&apos;s about to do, and runs it against your
        real apps and devices — nothing executes without your say-so.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/sign-up"
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
        >
          Get started free
        </Link>
        <a
          href="#how-it-works"
          className="rounded-full border border-black/[.08] px-6 py-3 text-sm font-medium transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          See how it works
        </a>
      </div>

      <div className="mt-16 w-full max-w-2xl rounded-2xl border border-black/[.08] bg-zinc-50 p-4 text-left shadow-sm dark:border-white/[.08] dark:bg-[#111]">
        <div className="flex items-center gap-3 rounded-xl border border-black/[.06] bg-white px-4 py-3 dark:border-white/[.08] dark:bg-black">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            &ldquo;Every Friday at 5, block my calendar for the next 3 hours
            and mute Slack.&rdquo;
          </p>
        </div>
        <div className="mt-3 rounded-xl border border-black/[.06] bg-white px-4 py-3 text-sm dark:border-white/[.08] dark:bg-black">
          <p className="font-medium">Proposed automation</p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            1. Create &ldquo;Focus time&rdquo; on your calendar, 3 hours,
            recurring Fridays at 5pm
            <br />
            2. Set Slack status to &ldquo;muted&rdquo; for the same window
          </p>
        </div>
      </div>
    </section>
  );
}
