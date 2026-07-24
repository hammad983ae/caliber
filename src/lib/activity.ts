export interface ActivityEntry {
  id: string;
  automationId: string;
  automationName: string;
  connectors: string[];
  status: "success" | "partial" | "failed";
  at: string;
  summary: string;
  undoable: boolean;
  scope: "personal" | "team";
  ranBy?: { name: string; imageUrl?: string };
}

export const SEED_ACTIVITY: ActivityEntry[] = [
  {
    id: "act-1",
    automationId: "focus-mode",
    automationName: "Focus mode",
    connectors: ["calendar", "message"],
    status: "success",
    at: "2 hours ago",
    summary: "Blocked 3 hours on your calendar and muted Slack.",
    undoable: true,
    scope: "personal",
  },
  {
    id: "act-2",
    automationId: "new-lead-alert",
    automationName: "New lead alert",
    connectors: ["message", "check"],
    status: "success",
    at: "35 minutes ago",
    summary: "Notified #sales and created a follow-up task.",
    undoable: false,
    scope: "personal",
  },
  {
    id: "act-3",
    automationId: "meeting-follow-up",
    automationName: "Meeting follow-up",
    connectors: ["calendar", "mail"],
    status: "failed",
    at: "1 hour ago",
    summary: "Couldn't draft the recap email — Gmail connection expired.",
    undoable: false,
    scope: "personal",
  },
  {
    id: "act-4",
    automationId: "evening-wind-down",
    automationName: "Evening wind-down",
    connectors: ["bulb", "lock"],
    status: "partial",
    at: "Yesterday",
    summary: "Dimmed the lights, but the door lock didn't respond in time.",
    undoable: true,
    scope: "personal",
  },
  {
    id: "act-5",
    automationId: "weekly-digest",
    automationName: "Weekly digest",
    connectors: ["mail"],
    status: "success",
    at: "3 days ago",
    summary: "Sent a digest of last week's starred emails.",
    undoable: false,
    scope: "personal",
  },
  {
    id: "act-6",
    automationId: "focus-mode",
    automationName: "Focus mode",
    connectors: ["calendar", "message"],
    status: "success",
    at: "1 week ago",
    summary: "Blocked 3 hours on your calendar and muted Slack.",
    undoable: false,
    scope: "personal",
  },
];
