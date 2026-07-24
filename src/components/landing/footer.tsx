export function Footer() {
  return (
    <footer className="px-6 pb-10">
      <div className="mx-auto h-px max-w-6xl bg-gradient-to-r from-transparent via-black/10 to-transparent dark:via-white/10" />
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 pt-8 text-sm text-zinc-500 sm:flex-row dark:text-zinc-500">
        <p>&copy; {new Date().getFullYear()} Caliber</p>
        <p>Voice-driven automation, closed end to end.</p>
      </div>
    </footer>
  );
}
