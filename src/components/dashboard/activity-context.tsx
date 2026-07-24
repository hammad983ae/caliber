"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useOrganization } from "@clerk/nextjs";
import { SEED_ACTIVITY, type ActivityEntry } from "@/lib/activity";

interface ActivityContextValue {
  entries: ActivityEntry[];
  undoEntry: (id: string) => void;
}

const ActivityContext = createContext<ActivityContextValue | null>(null);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<ActivityEntry[]>(SEED_ACTIVITY);
  const { organization } = useOrganization();

  const entries = useMemo(
    () => all.filter((e) => (organization ? e.scope === "team" : e.scope === "personal")),
    [all, organization],
  );

  const undoEntry = (id: string) => {
    setAll((prev) =>
      prev.map((e) => (e.id === id ? { ...e, undoable: false, summary: `${e.summary} (undone)` } : e)),
    );
  };

  return (
    <ActivityContext.Provider value={{ entries, undoEntry }}>
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
