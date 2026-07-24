import Link from "next/link";
import { ConnectorIcon } from "@/components/landing/connector-icon";

const templates = [
  {
    slug: "focus-mode",
    title: "Focus mode",
    trigger: "You say \"start focus mode\"",
    steps: ["Block 3 hours as “Focus time”", "Set Slack status to muted"],
    connectors: ["calendar", "message"],
  },
  {
    slug: "new-lead-alert",
    title: "New lead alert",
    trigger: "A new lead fills out your contact form",
    steps: ["Notify #sales", "Create a follow-up task"],
    connectors: ["message", "check"],
  },
  {
    slug: "evening-wind-down",
    title: "Evening wind-down",
    trigger: "Every day at sunset",
    steps: ["Dim the lights to 20%", "Lock the front door"],
    connectors: ["bulb", "lock"],
  },
  {
    slug: "meeting-follow-up",
    title: "Meeting follow-up",
    trigger: "A calendar event with notes ends",
    steps: ["Draft a recap email to attendees"],
    connectors: ["calendar", "mail"],
  },
  {
    slug: "weekly-digest",
    title: "Weekly digest",
    trigger: "Every Monday at 8am",
    steps: ["Summarize starred emails from last week", "Send as a single digest"],
    connectors: ["mail"],
  },
  {
    slug: "away-mode",
    title: "Away mode",
    trigger: "You leave the house",
    steps: ["Turn off all the lights", "Mute non-urgent notifications"],
    connectors: ["bulb", "bell"],
  },
];

export function Automations() {
  return (
    <section id="automations" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready-made automations to start from
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Don&apos;t start from a blank input — grab one of these and make
            it yours.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <div
              key={t.slug}
              className="flex flex-col rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm transition-shadow hover:shadow-md dark:bg-white/[0.03] dark:ring-white/10"
            >
              <div className="flex items-center gap-1.5">
                {t.connectors.map((icon) => (
                  <span
                    key={icon}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-300"
                  >
                    <ConnectorIcon icon={icon} className="h-4 w-4" />
                  </span>
                ))}
              </div>

              <h3 className="mt-4 text-base font-medium">{t.title}</h3>

              <div className="mt-3 rounded-2xl bg-black/[.03] p-4 text-sm dark:bg-white/[0.04]">
                <p className="text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    When:
                  </span>{" "}
                  {t.trigger}
                </p>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">
                    Then:
                  </span>{" "}
                  {t.steps.join(" · ")}
                </p>
              </div>

              <Link
                href={`/sign-up?template=${t.slug}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-indigo-700 hover:gap-1.5 dark:text-indigo-300"
              >
                Use this template
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
