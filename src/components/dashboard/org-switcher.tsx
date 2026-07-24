"use client";

import { useState } from "react";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";

export function OrgSwitcher() {
  const { organization } = useOrganization();
  const { isLoaded, userMemberships, createOrganization, setActive } = useOrganizationList({
    userMemberships: true,
  });
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const switchTo = async (orgId: string | null) => {
    if (!setActive) return;
    setBusy(true);
    await setActive({ organization: orgId });
    setBusy(false);
    setOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createOrganization || !name.trim()) return;
    setBusy(true);
    const org = await createOrganization({ name: name.trim() });
    await setActive?.({ organization: org.id });
    setBusy(false);
    setCreating(false);
    setName("");
    setOpen(false);
  };

  if (!isLoaded) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-xl bg-black/[.03] px-3 py-2 text-sm font-medium transition-colors hover:bg-black/[.06] dark:bg-white/[.04] dark:hover:bg-white/[.08]"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-semibold text-white">
            {organization ? organization.name.slice(0, 1).toUpperCase() : "P"}
          </span>
          <span className="truncate">{organization ? organization.name : "Personal"}</span>
        </span>
        <ChevronIcon className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setOpen(false);
              setCreating(false);
            }}
          />
          <div className="absolute top-full left-0 z-50 mt-2 w-full min-w-[14rem] rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10">
            <button
              type="button"
              disabled={busy}
              onClick={() => switchTo(null)}
              className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.06] ${
                !organization ? "font-medium text-indigo-600 dark:text-indigo-400" : ""
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/[.06] text-[10px] dark:bg-white/[.1]">
                P
              </span>
              Personal
            </button>

            {userMemberships.data?.map((m) => (
              <button
                key={m.id}
                type="button"
                disabled={busy}
                onClick={() => switchTo(m.organization.id)}
                className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.06] ${
                  organization?.id === m.organization.id
                    ? "font-medium text-indigo-600 dark:text-indigo-400"
                    : ""
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/[.06] text-[10px] dark:bg-white/[.1]">
                  {m.organization.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="truncate">{m.organization.name}</span>
              </button>
            ))}

            <div className="mt-1 border-t border-black/5 pt-1 dark:border-white/10">
              {creating ? (
                <form onSubmit={handleCreate} className="flex gap-1.5 p-1">
                  <input
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Team name"
                    className="min-w-0 flex-1 rounded-lg bg-black/[.04] px-2 py-1.5 text-sm outline-none dark:bg-white/[.06]"
                  />
                  <button
                    type="submit"
                    disabled={busy || !name.trim()}
                    className="shrink-0 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                  >
                    Create
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setCreating(true)}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm text-zinc-600 transition-colors hover:bg-black/[.04] dark:text-zinc-400 dark:hover:bg-white/[.06]"
                >
                  <span className="text-base leading-none">+</span>
                  New team
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
