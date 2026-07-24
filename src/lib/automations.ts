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
