"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useOrganization } from "@clerk/nextjs";
import type { ActivityEntry } from "@/lib/activity";

interface ActivityContextValue {
  entries: ActivityEntry[];
  loading: boolean;
  undoEntry: (id: string) => Promise<void>;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { organization, isLoaded } = useOrganization();
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/activity");
        const data = await res.json();
        if (!cancelled) setEntries(data.entries ?? []);
      } catch {
        if (!cancelled) setEntries([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, organization?.id]);

  const undoEntry = async (id: string) => {
    const res = await fetch(`/api/activity/${id}`, { method: "PATCH" });
    if (!res.ok) return;
    const data = await res.json();
    setEntries((prev) => prev.map((e) => (e.id === id ? data.entry : e)));
  };

  return (
    <ActivityContext.Provider value={{ entries, loading, undoEntry }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return ctx;
}
