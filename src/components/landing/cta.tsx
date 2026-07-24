import Link from "next/link";

export function Cta() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-6 py-16 text-center shadow-2xl shadow-indigo-500/30 sm:py-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent_50%)]"
        />

        <div className="relative">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Say what you want done.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-indigo-100">
            Free to try. Nothing runs against your accounts until you confirm
            it.
          </p>
          <Link
            href="/sign-up"
            className="mt-8 inline-block rounded-full bg-white px-6 py-3 text-sm font-medium text-indigo-700 shadow-lg transition-transform hover:scale-[1.03]"
          >
            Get started free
          </Link>
        </div>
      </div>
    </section>
  );
}
