import Link from "next/link";
import { Glow } from "@/components/landing/glow";
import { HeroInput } from "@/components/landing/hero-input";

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

        <HeroInput />

        <div className="mt-6 flex items-center gap-6 text-sm">
          <Link
            href="/sign-up"
            className="font-medium text-foreground underline decoration-black/20 underline-offset-4 hover:decoration-black/40 dark:decoration-white/20 dark:hover:decoration-white/40"
          >
            Get started free
          </Link>
          <a
            href="#how-it-works"
            className="text-zinc-600 hover:text-foreground dark:text-zinc-400"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
