import { Glow } from "@/components/landing/glow";

const useCases = [
  {
    category: "Personal",
    quote:
      "Summarize what came into my inbox overnight and read it back to me while I get ready.",
    outcome: "A spoken digest, ready before you've had coffee.",
  },
  {
    category: "Sales",
    quote:
      "When a new lead fills out the contact form, notify #sales and create a follow-up task.",
    outcome: "No lead sits untouched waiting for someone to notice.",
  },
  {
    category: "Home",
    quote: "Every evening at sunset, dim the lights and lock the front door.",
    outcome: "One phrase, the whole house settles in for the night.",
  },
  {
    category: "Productivity",
    quote:
      "Ten minutes before any call with a client, pull up our last email thread.",
    outcome: "Walk into every meeting already caught up.",
  },
  {
    category: "Personal",
    quote:
      "Archive anything from newsletters older than a week, every Sunday night.",
    outcome: "Inbox zero without the weekly cleanup ritual.",
  },
  {
    category: "Team",
    quote:
      "When a deploy finishes, post the changelog to #engineering and close the linked tickets.",
    outcome: "The team finds out the moment it matters, not later.",
  },
];

export function UseCases() {
  return (
    <section id="use-cases" className="relative overflow-hidden py-20 sm:py-28">
      <Glow className="right-1/2 top-1/4 h-[440px] w-[440px] translate-x-1/3 bg-gradient-to-br from-emerald-300/20 via-sky-300/15 to-transparent dark:from-emerald-500/10 dark:via-sky-500/10" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Whatever you&apos;d rather just say than set up
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            A few of the ways people are already putting Caliber to work,
            at home and at work.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u, i) => (
            <div
              key={u.quote}
              className={`rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-shadow hover:shadow-md dark:bg-white/[0.03] dark:ring-white/10 ${
                i % 2 === 1 ? "lg:translate-y-6" : ""
              }`}
            >
              <span className="rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium text-zinc-600 dark:bg-white/[.08] dark:text-zinc-300">
                {u.category}
              </span>
              <p className="mt-4 text-lg leading-snug text-balance">
                &ldquo;{u.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                {u.outcome}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
