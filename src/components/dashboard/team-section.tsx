"use client";

import { useState } from "react";
import { useOrganization } from "@clerk/nextjs";
import { ConnectorIcon } from "@/components/icons/connector-icon";

const teamApps = [
  { name: "Slack (shared)", icon: "message", connected: true },
  { name: "Google Calendar (shared)", icon: "calendar", connected: false },
];

function roleLabel(role: string) {
  return role === "org:admin" ? "Admin" : "Member";
}

export function TeamSection() {
  const { organization, membership, memberships } = useOrganization({ memberships: true });
  const [connections, setConnections] = useState(
    Object.fromEntries(teamApps.map((a) => [a.name, a.connected])),
  );
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"org:member" | "org:admin">("org:member");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  if (!organization) return null;

  const isAdmin = membership?.role === "org:admin";

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteStatus(null);
    try {
      await organization.inviteMember({ emailAddress: inviteEmail.trim(), role: inviteRole });
      setInviteStatus(`Invitation sent to ${inviteEmail.trim()}.`);
      setInviteEmail("");
    } catch {
      setInviteStatus("Couldn't send that invitation — check the email address and try again.");
    } finally {
      setInviting(false);
    }
  };

  return (
    <>
      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">{organization.name}</h2>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {organization.membersCount} member{organization.membersCount === 1 ? "" : "s"}
            </p>
          </div>
          <span className="rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium dark:bg-white/[.08]">
            You: {membership ? roleLabel(membership.role) : "—"}
          </span>
        </div>

        <ul className="mt-4 flex flex-col divide-y divide-black/5 dark:divide-white/10">
          {memberships?.data?.map((m) => (
            <li key={m.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- external Clerk-hosted avatar URL, not a local asset */}
                <img
                  src={m.publicUserData?.imageUrl ?? ""}
                  alt=""
                  className="h-8 w-8 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium">
                    {m.publicUserData?.firstName
                      ? `${m.publicUserData.firstName} ${m.publicUserData.lastName ?? ""}`.trim()
                      : m.publicUserData?.identifier}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {m.publicUserData?.identifier}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-black/[.04] px-2.5 py-1 text-xs font-medium dark:bg-white/[.08]">
                {roleLabel(m.role)}
              </span>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <form onSubmit={handleInvite} className="mt-4 flex flex-wrap gap-2 border-t border-black/5 pt-4 dark:border-white/10">
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@company.com"
              className="min-w-0 flex-1 rounded-lg bg-black/[.04] px-3 py-2 text-sm outline-none dark:bg-white/[.06]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as "org:member" | "org:admin")}
              className="rounded-lg bg-black/[.04] px-2 py-2 text-sm outline-none dark:bg-white/[.06]"
            >
              <option value="org:member">Member</option>
              <option value="org:admin">Admin</option>
            </select>
            <button
              type="submit"
              disabled={inviting}
              className="rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              Invite
            </button>
            {inviteStatus && (
              <p className="w-full text-sm text-zinc-500 dark:text-zinc-400">{inviteStatus}</p>
            )}
          </form>
        )}
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/[0.03] dark:ring-white/10">
        <h2 className="text-base font-medium">Team connected apps</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Shared credentials any team member&apos;s automations can use.
        </p>

        <ul className="mt-4 flex flex-col divide-y divide-black/5 dark:divide-white/10">
          {teamApps.map((app) => (
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
    </>
  );
}
