"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { SEED_AUTOMATIONS, type Automation } from "@/lib/automations";

interface AutomationsContextValue {
  automations: Automation[];
  addAutomation: (automation: Omit<Automation, "id" | "lastRun">) => Automation;
  toggleStatus: (id: string) => void;
}

const AutomationsContext = createContext<AutomationsContextValue | null>(null);

export function AutomationsProvider({ children }: { children: ReactNode }) {
  const [automations, setAutomations] = useState<Automation[]>(SEED_AUTOMATIONS);

  const addAutomation: AutomationsContextValue["addAutomation"] = (input) => {
    const automation: Automation = {
      ...input,
      id: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      lastRun: null,
    };
    setAutomations((prev) => [automation, ...prev]);
    return automation;
  };

  const toggleStatus = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a,
      ),
    );
  };

  return (
    <AutomationsContext.Provider value={{ automations, addAutomation, toggleStatus }}>
      {children}
    </AutomationsContext.Provider>
  );
}

export function useAutomations() {
  const ctx = useContext(AutomationsContext);
  if (!ctx) {
    throw new Error("useAutomations must be used within an AutomationsProvider");
  }
  return ctx;
}
