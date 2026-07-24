import Link from "next/link";
import { Glow } from "@/components/landing/glow";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Glow className="left-1/2 top-[-220px] h-[560px] w-[860px] -translate-x-1/2 bg-gradient-to-br from-indigo-400/40 via-violet-400/30 to-sky-300/20 dark:from-indigo-500/25 dark:via-violet-500/20 dark:to-sky-500/10" />
      <Glow className="right-[-160px] top-[120px] h-[360px] w-[360px] bg-gradient-to-br from-fuchsia-300/30 to-transparent dark:from-fuchsia-500/15" />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-20 pb-16 text-center sm:pt-28 sm:pb-24">
        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-300">
          Say it. Confirm it. It runs.
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Turn what you say into{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-violet-400 dark:to-fuchsia-400">
            automation that actually happens
          </span>
          .
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          Speak or type what you want done. Caliber figures out the automation,
          shows you exactly what it&apos;s about to do, and runs it against your
          real apps and devices — nothing executes without your say-so.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background shadow-lg shadow-indigo-500/20 transition-transform hover:scale-[1.03] dark:shadow-indigo-500/10"
          >
            Get started free
          </Link>
          <a
            href="#how-it-works"
            className="rounded-full bg-black/[.04] px-6 py-3 text-sm font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/[.1]"
          >
            See how it works
          </a>
        </div>

        <div className="relative mt-16 w-full max-w-2xl rotate-[-1deg] rounded-3xl bg-white/70 p-4 text-left shadow-2xl shadow-indigo-950/10 ring-1 ring-black/5 backdrop-blur-xl dark:bg-white/[0.04] dark:shadow-black/40 dark:ring-white/10">
          <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm dark:bg-white/[0.03]">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-orange-400 text-white shadow-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-white/90" />
            </span>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              &ldquo;Every Friday at 5, block my calendar for the next 3 hours
              and mute Slack.&rdquo;
            </p>
          </div>
          <div className="mt-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 px-4 py-3 text-sm shadow-sm dark:from-indigo-500/10 dark:to-violet-500/10">
            <p className="font-medium">Proposed automation</p>
            <p className="mt-1 text-zinc-600 dark:text-zinc-400">
              1. Create &ldquo;Focus time&rdquo; on your calendar, 3 hours,
              recurring Fridays at 5pm
              <br />
              2. Set Slack status to &ldquo;muted&rdquo; for the same window
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
