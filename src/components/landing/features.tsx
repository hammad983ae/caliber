const features = [
  {
    title: "Voice & text input",
    description:
      "One input surface. Speak with live streaming transcription you can edit, or just type — your history is saved so past requests are easy to reuse.",
  },
  {
    title: "AI-proposed automations",
    description:
      "Every request is parsed into a clear trigger, condition, and action. Ambiguous? You get a clarifying question, never a silent guess.",
  },
  {
    title: "Real execution, not just a plan",
    description:
      "Connectors for the apps, web services, and devices you actually use carry out each step in order, and report exactly what happened.",
  },
  {
    title: "Confirm before anything risky",
    description:
      "Destructive or hard-to-reverse actions always require your sign-off by default. Mark trusted, low-risk automations as always-allow.",
  },
  {
    title: "Multi-step, chained automations",
    description:
      "Chain steps across multiple connectors in one request, then save the whole thing as a reusable, named shortcut you can trigger again.",
  },
  {
    title: "Built for teams",
    description:
      "Shared automations, role-based access, and approval chains so a teammate's automation can require sign-off before it runs.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-t border-black/[.06] dark:border-white/[.08]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Everything the loop needs, closed end to end
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            From capturing what you meant to actually doing it — and knowing
            what to ask permission for along the way.
          </p>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title}>
              <h3 className="text-base font-medium">{f.title}</h3>
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
