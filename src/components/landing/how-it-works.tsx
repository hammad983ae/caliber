import { Glow } from "@/components/landing/glow";

const steps = [
  {
    step: "01",
    title: "Speak or type your request",
    description:
      "Tap the mic and say what you want, or type it — the transcript streams live so you can see it's understood correctly.",
  },
  {
    step: "02",
    title: "Review the proposed automation",
    description:
      "Caliber breaks your request into a plain-language summary plus the exact trigger, condition, and action it will run.",
  },
  {
    step: "03",
    title: "Confirm, and it runs for real",
    description:
      "Risky or irreversible steps always ask first. Once approved, the automation executes against your connected apps and devices.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-20 sm:py-28">
      <Glow className="left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-sky-300/20 via-indigo-300/15 to-transparent dark:from-sky-500/10 dark:via-indigo-500/10" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From a sentence to a finished task
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No triggers to configure, no apps to wire together by hand.
            Caliber does the translation from intent to execution.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((s) => (
            <li
              key={s.step}
              className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-shadow hover:shadow-md dark:bg-white/[0.03] dark:ring-white/10"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-medium text-white shadow-sm shadow-indigo-500/30">
                {s.step}
              </span>
              <h3 className="mt-4 text-lg font-medium">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {s.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
