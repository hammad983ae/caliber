"use client";

import { useRouter } from "next/navigation";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { MicIcon } from "@/components/icons/mic-icon";
import { ArrowUpIcon } from "@/components/icons/arrow-up-icon";

const PLACEHOLDER =
  "Every Friday at 5, block my calendar for the next 3 hours and mute Slack.";

export function HeroInput() {
  const router = useRouter();
  const { text, setText, listening, supported, notice, toggleMic, stopListening } =
    useSpeechRecognition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    stopListening();
    router.push(`/sign-up?intent=${encodeURIComponent(text.trim())}`);
  };

  return (
    <div className="relative mt-16 w-full max-w-2xl rounded-3xl bg-white/70 p-4 text-left shadow-2xl shadow-indigo-950/10 ring-1 ring-black/5 backdrop-blur-xl dark:bg-white/[0.04] dark:shadow-black/40 dark:ring-white/10">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-2xl bg-white/80 p-2 pl-4 shadow-sm dark:bg-white/[0.03]"
      >
        <button
          type="button"
          onClick={toggleMic}
          disabled={!supported}
          aria-pressed={listening}
          aria-label={listening ? "Stop voice input" : "Start voice input"}
          className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            listening
              ? "bg-gradient-to-br from-rose-500 to-orange-400 text-white"
              : "bg-black/[.05] text-zinc-600 hover:bg-black/[.09] dark:bg-white/[.08] dark:text-zinc-300 dark:hover:bg-white/[.14]"
          }`}
        >
          {listening && (
            <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/50" />
          )}
          <MicIcon className="relative h-4.5 w-4.5" />
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={listening ? "Listening…" : PLACEHOLDER}
          aria-label="Describe what you want to automate"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
        />

        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Submit request"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/30 transition-transform disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none enabled:hover:scale-105"
        >
          <ArrowUpIcon className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-3 px-2 text-xs text-zinc-500 dark:text-zinc-400">
        {notice ?? (
          <>
            Try it for real — you&apos;ll just need a free account to actually
            run it.
            {!supported && " Voice input isn't supported in this browser; typing works everywhere."}
          </>
        )}
      </p>
    </div>
  );
}
