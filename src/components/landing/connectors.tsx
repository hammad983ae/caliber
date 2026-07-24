import { ConnectorIcon } from "@/components/landing/connector-icon";

const apps = [
  { name: "Gmail", icon: "mail" },
  { name: "Google Calendar", icon: "calendar" },
  { name: "Slack", icon: "message" },
  { name: "Notion", icon: "doc" },
  { name: "Philips Hue", icon: "bulb" },
  { name: "Spotify", icon: "music" },
  { name: "Zoom", icon: "video" },
  { name: "Google Sheets", icon: "grid" },
  { name: "Discord", icon: "hash" },
  { name: "Twilio SMS", icon: "phone" },
  { name: "Trello", icon: "check" },
  { name: "GitHub", icon: "code" },
];

function Chip({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full bg-white/70 px-4 py-2.5 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.04] dark:ring-white/10">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-300">
        <ConnectorIcon icon={icon} className="h-3.5 w-3.5" />
      </span>
      <span className="text-sm font-medium whitespace-nowrap">{name}</span>
    </div>
  );
}

function Row({ direction }: { direction: "left" | "right" }) {
  const list = [...apps, ...apps];
  return (
    <div
      className={`marquee-track flex w-max shrink-0 gap-3 ${
        direction === "left" ? "animate-marquee-left" : "animate-marquee-right"
      }`}
    >
      {list.map((app, i) => (
        <Chip key={`${app.name}-${i}`} {...app} />
      ))}
    </div>
  );
}

export function Connectors() {
  return (
    <section id="connectors" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Connects to the apps you already use
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">
            Each connector is its own module with its own auth and API calls
            — new integrations show up without changing how automations are
            built or approved.
          </p>
        </div>
      </div>

      <div className="relative mt-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex flex-col gap-3 overflow-hidden">
          <Row direction="left" />
          <Row direction="right" />
        </div>
      </div>
    </section>
  );
}
