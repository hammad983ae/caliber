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
    <section id="how-it-works" className="border-t border-black/[.06] dark:border-white/[.08]">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            From a sentence to a finished task
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            No triggers to configure, no apps to wire together by hand.
            Caliber does the translation from intent to execution.
          </p>
        </div>

        <ol className="mt-12 grid gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <li key={s.step}>
              <span className="text-sm font-mono text-zinc-400 dark:text-zinc-600">
                {s.step}
              </span>
              <h3 className="mt-3 text-lg font-medium">{s.title}</h3>
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
