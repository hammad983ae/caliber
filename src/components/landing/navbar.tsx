import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md dark:bg-black/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Caliber
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400 sm:flex">
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#teams" className="hover:text-foreground">
            For teams
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-600 hover:text-foreground dark:text-zinc-400"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
            >
              Get started
            </Link>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>
    </header>
  );
}
