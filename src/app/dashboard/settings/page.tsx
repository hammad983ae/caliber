"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import { AppLogo } from "@/components/icons/app-logo";
import { ToggleSwitch } from "@/components/dashboard/toggle-switch";
import { TeamSection } from "@/components/dashboard/team-section";
import { CONNECTORS, MOCK_CONNECTOR_IDS, type ConnectorId } from "@/lib/connector-registry";
import { useConnectorStatus } from "@/hooks/use-connector-status";

const CONNECTOR_ERROR_MESSAGES: Record<string, string> = {
  not_configured: "Google Calendar isn't configured on this deployment yet.",
  invalid_state: "That connection attempt looked suspicious, so we stopped it. Try again.",
  token_exchange_failed: "Google didn't accept that connection. Try again.",
  save_failed: "Google approved the connection, but saving it failed.",
  access_denied: "You cancelled the Google Calendar connection.",
};

const SHEETS_ERROR_MESSAGES: Record<string, string> = {
  not_configured: "Google Sheets isn't configured on this deployment yet.",
  invalid_state: "That connection attempt looked suspicious, so we stopped it. Try again.",
  token_exchange_failed: "Google didn't accept that connection. Try again.",
  save_failed: "Google approved the connection, but saving it failed.",
  access_denied: "You cancelled the Google Sheets connection.",
};

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const { user } = useUser();
  const clerk = useClerk();
  const searchParams = useSearchParams();
  const { status, loading: statusLoading, refresh } = useConnectorStatus();
  const [busyConnector, setBusyConnector] = useState<ConnectorId | null>(null);
  const [notifications, setNotifications] = useState({
    failures: true,
    weeklySummary: true,
    productUpdates: false,
  });

  const redirectConnected = searchParams.get("connected") === "google_calendar";
  const redirectError = searchParams.get("connector_error");
  const redirectDebug = searchParams.get("connector_debug");

  const [gcalNotice, setGcalNotice] = useState<string | null>(() => {
    if (redirectConnected) return "Google Calendar connected.";
    if (redirectError) {
      const base = CONNECTOR_ERROR_MESSAGES[redirectError] ?? "Couldn't connect Google Calendar.";
      return redirectDebug ? `${base} Details: ${redirectDebug}` : base;
    }
    return null;
  });

  const sheetsRedirectConnected = searchParams.get("sheets_connected") === "1";
  const sheetsRedirectError = searchParams.get("sheets_error");
  const sheetsRedirectDebug = searchParams.get("sheets_debug");

  const [sheetsNotice, setSheetsNotice] = useState<string | null>(() => {
    if (sheetsRedirectConnected) return "Google Sheets connected.";
    if (sheetsRedirectError) {
      const base = SHEETS_ERROR_MESSAGES[sheetsRedirectError] ?? "Couldn't connect Google Sheets.";
      return sheetsRedirectDebug ? `${base} Details: ${sheetsRedirectDebug}` : base;
    }
    return null;
  });

  const handleDisconnectGoogleCalendar = async () => {
    setBusyConnector("google_calendar");
    try {
      await fetch("/api/connectors/google-calendar/disconnect", { method: "POST" });
      await refresh();
      setGcalNotice("Google Calendar disconnected.");
    } finally {
      setBusyConnector(null);
    }
  };

  const handleDisconnectGoogleSheets = async () => {
    setBusyConnector("google_sheets");
    try {
      await fetch("/api/connectors/google-sheets/disconnect", { method: "POST" });
      await refresh();
      setSheetsNotice("Google Sheets disconnected.");
    } finally {
      setBusyConnector(null);
    }
  };

  const handleToggleMockConnector = async (id: ConnectorId, connected: boolean) => {
    setBusyConnector(id);
    try {
      await fetch(`/api/connectors/mock/${id}`, { method: connected ? "DELETE" : "POST" });
      await refresh();
    } finally {
      setBusyConnector(null);
    }
  };

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

      <TeamSection />

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
        <h2 className="text-base font-medium">Connected apps</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Automations can only use apps you&apos;ve connected here.
        </p>

        {gcalNotice && (
          <p className="mt-3 rounded-xl bg-indigo-500/10 px-4 py-2.5 text-sm text-indigo-700 dark:text-indigo-300">
            {gcalNotice}
          </p>
        )}
        {sheetsNotice && (
          <p className="mt-3 rounded-xl bg-indigo-500/10 px-4 py-2.5 text-sm text-indigo-700 dark:text-indigo-300">
            {sheetsNotice}
          </p>
        )}

        <ul className="mt-4 flex flex-col divide-y divide-black/5 dark:divide-white/10">
          <li className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <AppLogo app="google_calendar" className="h-8 w-8 rounded-lg shadow-sm" />
              <span className="text-sm font-medium">Google Calendar</span>
            </div>
            {statusLoading ? (
              <span className="text-xs text-zinc-400">Checking…</span>
            ) : status.google_calendar ? (
              <button
                onClick={handleDisconnectGoogleCalendar}
                disabled={busyConnector === "google_calendar"}
                className="rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-rose-500/10 hover:text-rose-700 disabled:opacity-50 dark:text-emerald-300 dark:hover:text-rose-300"
              >
                {busyConnector === "google_calendar" ? "Disconnecting…" : "Connected"}
              </button>
            ) : (
              <a
                href="/api/connectors/google-calendar/connect"
                className="rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:text-zinc-300 dark:hover:bg-white/[.1]"
              >
                Connect
              </a>
            )}
          </li>

          <li className="flex flex-col gap-3 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AppLogo app="google_sheets" className="h-8 w-8 rounded-lg shadow-sm" />
                <span className="text-sm font-medium">Google Sheets</span>
              </div>
              {statusLoading ? (
                <span className="text-xs text-zinc-400">Checking…</span>
              ) : status.google_sheets ? (
                <button
                  onClick={handleDisconnectGoogleSheets}
                  disabled={busyConnector === "google_sheets"}
                  className="rounded-full bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-rose-500/10 hover:text-rose-700 disabled:opacity-50 dark:text-emerald-300 dark:hover:text-rose-300"
                >
                  {busyConnector === "google_sheets" ? "Disconnecting…" : "Connected"}
                </button>
              ) : (
                <a
                  href="/api/connectors/google-sheets/connect"
                  className="rounded-full bg-black/[.04] px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:text-zinc-300 dark:hover:bg-white/[.1]"
                >
                  Connect
                </a>
              )}
            </div>
            {status.google_sheets && <SheetsConfigForm />}
          </li>

          {MOCK_CONNECTOR_IDS.map((id) => {
            const info = CONNECTORS[id];
            const connected = Boolean(status[id]);
            return (
              <li key={id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <AppLogo app={id} className="h-8 w-8 rounded-lg shadow-sm" />
                  <span className="text-sm font-medium">{info.name}</span>
                </div>
                <button
                  onClick={() => handleToggleMockConnector(id, connected)}
                  disabled={statusLoading || busyConnector === id}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
                    connected
                      ? "bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-black/[.04] text-zinc-600 hover:bg-black/[.07] dark:bg-white/[.06] dark:text-zinc-300 dark:hover:bg-white/[.1]"
                  }`}
                >
                  {busyConnector === id ? "…" : connected ? "Connected" : "Connect"}
                </button>
              </li>
            );
          })}
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

function SheetsConfigForm() {
  const [spreadsheet, setSpreadsheet] = useState("");
  const [sheetName, setSheetName] = useState("Sheet1");
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/connectors/google-sheets/config");
        const data = await res.json();
        if (!cancelled) {
          if (data.spreadsheetId) setSpreadsheet(data.spreadsheetId);
          if (data.sheetName) setSheetName(data.sheetName);
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch("/api/connectors/google-sheets/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ spreadsheet, sheetName }),
      });
      setNotice(res.ok ? "Saved." : "That doesn't look like a valid spreadsheet link or ID.");
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return null;

  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col gap-2 rounded-2xl bg-black/[.02] p-3 dark:bg-white/[0.04] sm:flex-row sm:items-center"
    >
      <input
        value={spreadsheet}
        onChange={(e) => setSpreadsheet(e.target.value)}
        placeholder="Paste a Google Sheets link or ID"
        className="min-w-0 flex-1 rounded-full bg-white px-3.5 py-1.5 text-xs outline-none ring-1 ring-black/10 placeholder:text-zinc-400 dark:bg-black/20 dark:ring-white/10"
      />
      <input
        value={sheetName}
        onChange={(e) => setSheetName(e.target.value)}
        placeholder="Sheet1"
        className="w-full rounded-full bg-white px-3.5 py-1.5 text-xs outline-none ring-1 ring-black/10 placeholder:text-zinc-400 sm:w-24 dark:bg-black/20 dark:ring-white/10"
      />
      <button
        type="submit"
        disabled={saving || !spreadsheet.trim()}
        className="shrink-0 rounded-full bg-black/[.06] px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black/[.1] disabled:opacity-50 dark:bg-white/[.08] dark:hover:bg-white/[.14]"
      >
        {saving ? "Saving…" : "Save"}
      </button>
      {notice && <span className="text-xs text-zinc-500 dark:text-zinc-400">{notice}</span>}
    </form>
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
