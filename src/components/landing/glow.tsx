export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -z-10 rounded-full blur-3xl ${className ?? ""}`}
    />
  );
}
