export function Footer() {
  return (
    <footer className="border-t border-black/[.06] dark:border-white/[.08]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-zinc-500 sm:flex-row dark:text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Caliber</p>
        <p>Voice-driven automation, closed end to end.</p>
      </div>
    </footer>
  );
}
