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

export const SEED_AUTOMATIONS: Automation[] = [
  {
    id: "focus-mode",
    name: "Focus mode",
    status: "active",
    scope: "personal",
    connectors: ["calendar", "message"],
    steps: [
      { kind: "trigger", icon: "mic", description: 'You say "start focus mode"' },
      {
        kind: "action",
        icon: "calendar",
        description: 'Block 3 hours as "Focus time"',
        risk: "reversible",
      },
      {
        kind: "action",
        icon: "message",
        description: "Set Slack status to muted",
        risk: "reversible",
      },
    ],
    lastRun: { at: "2 hours ago", outcome: "success", detail: "Both steps completed" },
  },
  {
    id: "new-lead-alert",
    name: "New lead alert",
    status: "active",
    scope: "personal",
    connectors: ["message", "check"],
    steps: [
      {
        kind: "trigger",
        icon: "mail",
        description: "A new lead fills out the contact form",
      },
      { kind: "action", icon: "message", description: "Notify #sales", risk: "reversible" },
      {
        kind: "action",
        icon: "check",
        description: "Create a follow-up task",
        risk: "reversible",
      },
    ],
    lastRun: { at: "35 minutes ago", outcome: "success", detail: "Both steps completed" },
  },
  {
    id: "evening-wind-down",
    name: "Evening wind-down",
    status: "paused",
    scope: "personal",
    connectors: ["bulb", "lock"],
    steps: [
      { kind: "trigger", icon: "calendar", description: "Every day at sunset" },
      {
        kind: "action",
        icon: "bulb",
        description: "Dim the lights to 20%",
        risk: "reversible",
      },
      {
        kind: "action",
        icon: "lock",
        description: "Lock the front door",
        risk: "confirm",
      },
    ],
    lastRun: { at: "Yesterday", outcome: "success", detail: "Both steps completed" },
  },
  {
    id: "meeting-follow-up",
    name: "Meeting follow-up",
    status: "error",
    scope: "personal",
    connectors: ["calendar", "mail"],
    steps: [
      {
        kind: "trigger",
        icon: "calendar",
        description: "A calendar event with notes ends",
      },
      {
        kind: "action",
        icon: "mail",
        description: "Draft a recap email to attendees",
        risk: "confirm",
      },
    ],
    lastRun: {
      at: "1 hour ago",
      outcome: "failed",
      detail: "Gmail connection expired — reconnect in Settings",
    },
  },
  {
    id: "weekly-digest",
    name: "Weekly digest",
    status: "active",
    scope: "personal",
    connectors: ["mail"],
    steps: [
      { kind: "trigger", icon: "calendar", description: "Every Monday at 8am" },
      {
        kind: "action",
        icon: "mail",
        description: "Summarize starred emails from last week",
        risk: "read-only",
      },
      {
        kind: "action",
        icon: "mail",
        description: "Send as a single digest",
        risk: "reversible",
      },
    ],
    lastRun: { at: "3 days ago", outcome: "success", detail: "Both steps completed" },
  },
  {
    id: "away-mode",
    name: "Away mode",
    status: "draft",
    scope: "personal",
    connectors: ["bulb", "bell"],
    steps: [
      { kind: "trigger", icon: "hash", description: "You leave the house" },
      {
        kind: "action",
        icon: "bulb",
        description: "Turn off all the lights",
        risk: "reversible",
      },
      {
        kind: "action",
        icon: "bell",
        description: "Mute non-urgent notifications",
        risk: "reversible",
      },
    ],
    lastRun: null,
  },
];
