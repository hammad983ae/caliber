import { Glow } from "@/components/landing/glow";

const points = [
  {
    title: "Shared automations",
    description:
      "Publish an automation so any team member can trigger it by voice — no rebuilding it per person.",
  },
  {
    title: "Roles & approval chains",
    description:
      "Control who can create, edit, run, or approve automations, and require a second person's sign-off where it matters.",
  },
  {
    title: "Team activity log",
    description:
      "A shared, filterable log of every automation the team has run — not just your own.",
  },
];

export function Teams() {
  return (
    <section id="teams" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/70 p-10 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10 sm:p-16">
          <Glow className="right-[-120px] top-[-120px] h-[360px] w-[360px] bg-gradient-to-br from-sky-300/30 to-transparent dark:from-sky-500/15" />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                For teams, not just individuals
              </h2>
              <p className="mt-4 max-w-md text-zinc-600 dark:text-zinc-400">
                &ldquo;When a new lead comes in, notify sales and create a
                task&rdquo; — built once, shared with the whole workspace, and
                governed the way your team actually works.
              </p>
            </div>

            <dl className="grid gap-8 sm:grid-cols-1">
              {points.map((p) => (
                <div key={p.title}>
                  <dt className="text-base font-medium">{p.title}</dt>
                  <dd className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                    {p.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
