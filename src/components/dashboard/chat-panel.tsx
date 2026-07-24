"use client";

import { useEffect, useRef } from "react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { MicIcon } from "@/components/icons/mic-icon";
import { ArrowUpIcon } from "@/components/icons/arrow-up-icon";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Every Friday at 5, block my calendar and mute Slack",
  "When a new lead comes in, notify #sales",
  "Every evening at sunset, dim the lights",
];

export function ChatPanel({
  messages,
  thinking,
  onSend,
}: {
  messages: ChatMessage[];
  thinking: boolean;
  onSend: (text: string) => void;
}) {
  const { text, setText, listening, supported, notice, toggleMic, stopListening } =
    useSpeechRecognition();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  const submit = (value: string) => {
    if (!value.trim()) return;
    stopListening();
    onSend(value.trim());
    setText("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(text);
  };

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <span className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-medium text-white">
                C
              </span>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                m.role === "user"
                  ? "bg-foreground text-background"
                  : "bg-white/70 shadow-sm ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <span className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-medium text-white">
              C
            </span>
            <div className="flex items-center gap-1 rounded-2xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {messages.length <= 1 && !thinking && (
          <div className="flex flex-wrap gap-2 pt-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                className="rounded-full bg-black/[.04] px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:bg-black/[.07] dark:bg-white/[.06] dark:text-zinc-300 dark:hover:bg-white/[.1]"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-black/5 p-4 dark:border-white/10">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 rounded-2xl bg-white/80 p-2 pl-4 shadow-sm ring-1 ring-black/5 dark:bg-white/[0.03] dark:ring-white/10"
        >
          <button
            type="button"
            onClick={toggleMic}
            disabled={!supported}
            aria-pressed={listening}
            aria-label={listening ? "Stop voice input" : "Start voice input"}
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              listening
                ? "bg-gradient-to-br from-rose-500 to-orange-400 text-white"
                : "bg-black/[.05] text-zinc-600 hover:bg-black/[.09] dark:bg-white/[.08] dark:text-zinc-300 dark:hover:bg-white/[.14]"
            }`}
          >
            {listening && (
              <span className="absolute inset-0 animate-ping rounded-full bg-rose-400/50" />
            )}
            <MicIcon className="relative h-4 w-4" />
          </button>

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={listening ? "Listening…" : "Describe what should happen…"}
            aria-label="Message"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/30 transition-transform disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none enabled:hover:scale-105"
          >
            <ArrowUpIcon className="h-3.5 w-3.5" />
          </button>
        </form>

        {notice && (
          <p className="mt-2 px-2 text-xs text-zinc-500 dark:text-zinc-400">{notice}</p>
        )}
      </div>
    </div>
  );
}
