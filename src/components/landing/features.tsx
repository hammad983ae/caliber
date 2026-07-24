import { Glow } from "@/components/landing/glow";

const features = [
  {
    title: "Voice & text input",
    description:
      "One input surface. Speak with live streaming transcription you can edit, or just type — your history is saved so past requests are easy to reuse.",
    from: "from-indigo-500",
    to: "to-violet-500",
  },
  {
    title: "AI-proposed automations",
    description:
      "Every request is parsed into a clear trigger, condition, and action. Ambiguous? You get a clarifying question, never a silent guess.",
    from: "from-violet-500",
    to: "to-fuchsia-500",
  },
  {
    title: "Real execution, not just a plan",
    description:
      "Connectors for the apps, web services, and devices you actually use carry out each step in order, and report exactly what happened.",
    from: "from-sky-500",
    to: "to-indigo-500",
  },
  {
    title: "Confirm before anything risky",
    description:
      "Destructive or hard-to-reverse actions always require your sign-off by default. Mark trusted, low-risk automations as always-allow.",
    from: "from-rose-500",
    to: "to-orange-400",
  },
  {
    title: "Multi-step, chained automations",
    description:
      "Chain steps across multiple connectors in one request, then save the whole thing as a reusable, named shortcut you can trigger again.",
    from: "from-emerald-500",
    to: "to-sky-500",
  },
  {
    title: "Built for teams",
    description:
      "Shared automations, role-based access, and approval chains so a teammate's automation can require sign-off before it runs.",
    from: "from-fuchsia-500",
    to: "to-rose-500",
  },
];

export function Features() {
  return (
    <section id="features" className="relative overflow-hidden py-20 sm:py-28">
      <Glow className="left-[-200px] top-1/3 h-[420px] w-[420px] bg-gradient-to-br from-violet-300/25 to-transparent dark:from-violet-500/10" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything the loop needs, closed end to end
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            From capturing what you meant to actually doing it — and knowing
            what to ask permission for along the way.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-shadow hover:shadow-md dark:bg-white/[0.03] dark:ring-white/10"
            >
              <span
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${f.from} ${f.to} shadow-sm`}
              />
              <h3 className="mt-4 text-base font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
