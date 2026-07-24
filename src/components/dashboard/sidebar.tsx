"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const links = [
  { href: "/dashboard", label: "Automations", icon: "grid" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
];

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  if (icon === "settings") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-black/5 bg-zinc-50/60 px-4 py-6 dark:border-white/10 dark:bg-white/[0.02]">
      <Link href="/dashboard" className="px-2 text-lg font-semibold tracking-tight">
        Caliber
      </Link>

      <Link
        href="/dashboard/new"
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-500/30 transition-transform hover:scale-[1.02]"
      >
        <span className="text-base leading-none">+</span>
        New automation
      </Link>

      <nav className="mt-8 flex flex-col gap-1">
        {links.map((link) => {
          const active =
            link.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? "bg-white text-foreground shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10"
                  : "text-zinc-600 hover:bg-black/[.03] hover:text-foreground dark:text-zinc-400 dark:hover:bg-white/[.05]"
              }`}
            >
              <NavIcon icon={link.icon} className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex items-center gap-3 px-2 pt-6">
        <UserButton />
        <Link
          href="/"
          className="text-xs text-zinc-500 hover:text-foreground dark:text-zinc-400"
        >
          Back to site
        </Link>
      </div>
    </aside>
  );
}
