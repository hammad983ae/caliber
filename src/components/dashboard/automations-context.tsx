"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { useOrganization, useUser } from "@clerk/nextjs";
import { SEED_AUTOMATIONS, type Automation } from "@/lib/automations";

type NewAutomationInput = Omit<
  Automation,
  "id" | "lastRun" | "scope" | "orgId" | "createdBy"
>;

interface AutomationsContextValue {
  automations: Automation[];
  workspace: "personal" | "team";
  addAutomation: (input: NewAutomationInput) => Automation;
  toggleStatus: (id: string) => void;
  setAlwaysAllow: (id: string, value: boolean) => void;
  approveAutomation: (id: string) => void;
  rejectAutomation: (id: string) => void;
}

const AutomationsContext = createContext<AutomationsContextValue | null>(null);

export function AutomationsProvider({ children }: { children: ReactNode }) {
  const [all, setAll] = useState<Automation[]>(SEED_AUTOMATIONS);
  const { organization } = useOrganization();
  const { user } = useUser();

  const automations = useMemo(
    () =>
      all.filter((a) =>
        organization ? a.scope === "team" && a.orgId === organization.id : a.scope === "personal",
      ),
    [all, organization],
  );

  const addAutomation: AutomationsContextValue["addAutomation"] = (input) => {
    const automation: Automation = {
      ...input,
      id: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
      lastRun: null,
      scope: organization ? "team" : "personal",
      orgId: organization?.id,
      createdBy: user
        ? { name: user.fullName ?? "You", imageUrl: user.imageUrl }
        : undefined,
    };
    setAll((prev) => [automation, ...prev]);
    return automation;
  };

  const toggleStatus = (id: string) => {
    setAll((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a,
      ),
    );
  };

  const setAlwaysAllow = (id: string, value: boolean) => {
    setAll((prev) => prev.map((a) => (a.id === id ? { ...a, alwaysAllow: value } : a)));
  };

  const approveAutomation = (id: string) => {
    setAll((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "active" } : a)),
    );
  };

  const rejectAutomation = (id: string) => {
    setAll((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AutomationsContext.Provider
      value={{
        automations,
        workspace: organization ? "team" : "personal",
        addAutomation,
        toggleStatus,
        setAlwaysAllow,
        approveAutomation,
        rejectAutomation,
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
