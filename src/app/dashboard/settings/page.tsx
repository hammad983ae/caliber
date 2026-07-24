"use client";

import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { ConnectorIcon } from "@/components/icons/connector-icon";
import { ToggleSwitch } from "@/components/dashboard/toggle-switch";

const apps = [
  { name: "Gmail", icon: "mail", connected: true },
  { name: "Google Calendar", icon: "calendar", connected: true },
  { name: "Slack", icon: "message", connected: true },
  { name: "Philips Hue", icon: "bulb", connected: false },
  { name: "Notion", icon: "doc", connected: false },
  { name: "Spotify", icon: "music", connected: false },
];

export default function SettingsPage() {
  const { user } = useUser();
  const clerk = useClerk();
  const [connections, setConnections] = useState(
    Object.fromEntries(apps.map((a) => [a.name, a.connected])),
  );
  const [notifications, setNotifications] = useState({
    failures: true,
    weeklySummary: true,
    productUpdates: false,
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Manage your account, connections, and notifications.
      </p>

      <section className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
        <h2 className="text-base font-medium">Profile</h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {user?.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt=""
                className="h-10 w-10 rounded-full"
              />
            )}
            <div>
              <p className="text-sm font-medium">
                {user?.fullName ?? "Your account"}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
          <button
            onClick={() => clerk.openUserProfile()}
            className="shrink-0 rounded-full bg-black/[.04] px-4 py-2 text-sm font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:hover:bg-white/[.1]"
          >
            Manage account
          </button>
        </div>
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
        <h2 className="text-base font-medium">Connected apps</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Automations can only use apps you&apos;ve connected here.
        </p>

        <ul className="mt-4 flex flex-col divide-y divide-black/5 dark:divide-white/10">
          {apps.map((app) => (
            <li key={app.name} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-300">
                  <ConnectorIcon icon={app.icon} className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{app.name}</span>
              </div>
              <button
                onClick={() =>
                  setConnections((prev) => ({ ...prev, [app.name]: !prev[app.name] }))
                }
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  connections[app.name]
                    ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
                    : "bg-black/[.04] text-zinc-600 hover:bg-black/[.07] dark:bg-white/[.06] dark:text-zinc-300 dark:hover:bg-white/[.1]"
                }`}
              >
                {connections[app.name] ? "Connected" : "Connect"}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
        <h2 className="text-base font-medium">Notifications</h2>

        <ul className="mt-4 flex flex-col divide-y divide-black/5 dark:divide-white/10">
          <NotificationRow
            label="Email me when an automation fails"
            checked={notifications.failures}
            onChange={() =>
              setNotifications((p) => ({ ...p, failures: !p.failures }))
            }
          />
          <NotificationRow
            label="Weekly summary of what ran"
            checked={notifications.weeklySummary}
            onChange={() =>
              setNotifications((p) => ({ ...p, weeklySummary: !p.weeklySummary }))
            }
          />
          <NotificationRow
            label="Product updates"
            checked={notifications.productUpdates}
            onChange={() =>
              setNotifications((p) => ({ ...p, productUpdates: !p.productUpdates }))
            }
          />
        </ul>
      </section>

      <section className="mt-6 rounded-3xl bg-rose-500/5 p-6 ring-1 ring-rose-500/10">
        <h2 className="text-base font-medium text-rose-700 dark:text-rose-300">
          Danger zone
        </h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Permanently delete your account and all automations. This can&apos;t
          be undone.
        </p>
        <button className="mt-4 rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700">
          Delete account
        </button>
      </section>
    </div>
  );
}

function NotificationRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <li className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      <ToggleSwitch on={checked} onChange={onChange} label={label} />
    </li>
  );
}
