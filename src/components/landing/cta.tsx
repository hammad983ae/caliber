import { SignUpButton } from "@clerk/nextjs";

export function Cta() {
  return (
    <section className="border-t border-black/[.06] dark:border-white/[.08]">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Say what you want done.
        </h2>
        <p className="mt-4 max-w-xl text-zinc-600 dark:text-zinc-400">
          Free to try. Nothing runs against your accounts until you confirm
          it.
        </p>
        <SignUpButton mode="modal">
          <button className="mt-8 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
            Get started free
          </button>
        </SignUpButton>
      </div>
    </section>
  );
}
