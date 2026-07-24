"use client";

import { GoogleIcon } from "@/components/auth/google-icon";

export function GoogleButton({
  onClick,
  loading,
}: {
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-black/[.08] bg-white px-4 py-2.5 text-sm font-medium transition-colors hover:bg-black/[.02] disabled:opacity-60 dark:border-white/[.145] dark:bg-black dark:hover:bg-white/[.04]"
    >
      <GoogleIcon className="h-4 w-4" />
      Continue with Google
    </button>
  );
}
