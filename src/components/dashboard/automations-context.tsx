"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useOrganization } from "@clerk/nextjs";
import type { Automation, AutomationStatus, FlowStep } from "@/lib/automations";

type NewAutomationInput = {
  name: string;
  status: AutomationStatus;
  connectors: string[];
  steps: FlowStep[];
  alwaysAllow?: boolean;
  createdBy?: { name: string; imageUrl?: string };
};

interface AutomationsContextValue {
  automations: Automation[];
  loading: boolean;
  workspace: "personal" | "team";
  addAutomation: (input: NewAutomationInput) => Promise<Automation>;
  toggleStatus: (id: string) => Promise<void>;
  setAlwaysAllow: (id: string, value: boolean) => Promise<void>;
  approveAutomation: (id: string) => Promise<void>;
  rejectAutomation: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const AutomationsContext = createContext<AutomationsContextValue | null>(null);

async function parseJson(res: Response) {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed with ${res.status}`);
  }
  return data;
}

export function AutomationsProvider({ children }: { children: ReactNode }) {
  const { organization, isLoaded } = useOrganization();
  const [all, setAll] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const data = await parseJson(await fetch("/api/automations"));
    setAll(data.automations ?? []);
  };

  useEffect(() => {
    if (!isLoaded) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const data = await parseJson(await fetch("/api/automations"));
        if (!cancelled) setAll(data.automations ?? []);
      } catch {
        if (!cancelled) setAll([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, organization?.id]);

  const addAutomation: AutomationsContextValue["addAutomation"] = async (input) => {
    const data = await parseJson(
      await fetch("/api/automations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    );
    const automation = data.automation as Automation;
    setAll((prev) => [automation, ...prev]);
    return automation;
  };

  const patchAutomation = async (id: string, patch: { status?: AutomationStatus; alwaysAllow?: boolean }) => {
    const data = await parseJson(
      await fetch(`/api/automations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      }),
    );
    const automation = data.automation as Automation;
    setAll((prev) => prev.map((a) => (a.id === id ? automation : a)));
  };

  const toggleStatus = async (id: string) => {
    const current = all.find((a) => a.id === id);
    if (!current) return;
    await patchAutomation(id, { status: current.status === "active" ? "paused" : "active" });
  };

  const setAlwaysAllow = async (id: string, value: boolean) => {
    await patchAutomation(id, { alwaysAllow: value });
  };

  const approveAutomation = async (id: string) => {
    await patchAutomation(id, { status: "active" });
  };

  const rejectAutomation = async (id: string) => {
    await parseJson(await fetch(`/api/automations/${id}`, { method: "DELETE" }));
    setAll((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AutomationsContext.Provider
      value={{
        automations: all,
        loading,
        workspace: organization ? "team" : "personal",
        addAutomation,
        toggleStatus,
        setAlwaysAllow,
        approveAutomation,
        rejectAutomation,
        refresh,
      }}
    >
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
