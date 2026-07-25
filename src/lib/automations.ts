import type { ConnectorId } from "@/lib/connector-registry";

export type AutomationStatus =
  | "active"
  | "paused"
  | "error"
  | "draft"
  | "pending_approval";

export type FlowStepKind = "trigger" | "condition" | "action";

export type StepRisk = "read-only" | "reversible" | "confirm";

export interface FlowStep {
  kind: FlowStepKind;
  icon: string;
  description: string;
  risk?: StepRisk;
  /** The specific known app this step needs connected, if any (unset for voice/time triggers or unsupported apps). */
  app?: ConnectorId;
}

export interface LastRun {
  at: string;
  outcome: "success" | "partial" | "failed";
  detail: string;
}

export interface Automation {
  id: string;
  name: string;
  status: AutomationStatus;
  connectors: string[];
  steps: FlowStep[];
  lastRun: LastRun | null;
  /** "personal" automations are private to the creator; "team" ones belong to an active organization. */
  scope: "personal" | "team";
  orgId?: string;
  /** Skip the risk-tier confirmation modal for this automation going forward. */
  alwaysAllow?: boolean;
  createdBy?: { name: string; imageUrl?: string };
}
