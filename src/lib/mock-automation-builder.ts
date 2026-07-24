import type { FlowStep, StepRisk } from "@/lib/automations";

// Stands in for Feature 2's real AI intent-parser. Scans the message for
// known app/action keywords and assembles a plausible trigger/action
// breakdown so the create screen has something to react to before the
// real suggestion engine exists.

interface ActionRule {
  keywords: string[];
  icon: string;
  risk: StepRisk;
  describe: string;
}

const ACTION_VOCAB: ActionRule[] = [
  { keywords: ["slack", "mute", "status"], icon: "message", risk: "reversible", describe: "Update your Slack status" },
  { keywords: ["calendar", "block", "meeting", "event", "schedule"], icon: "calendar", risk: "reversible", describe: "Update your calendar" },
  { keywords: ["email", "gmail", "inbox", "mail", "recap"], icon: "mail", risk: "confirm", describe: "Draft or send an email" },
  { keywords: ["light", "lights", "hue", "dim", "bulb"], icon: "bulb", risk: "reversible", describe: "Adjust the lights" },
  { keywords: ["lock", "door", "unlock"], icon: "lock", risk: "confirm", describe: "Lock or unlock the door" },
  { keywords: ["task", "todo", "trello", "assign", "follow-up", "follow up"], icon: "check", risk: "reversible", describe: "Create a task" },
  { keywords: ["notify", "alert", "ping", "sales", "team", "#"], icon: "bell", risk: "reversible", describe: "Send a notification" },
  { keywords: ["music", "spotify", "playlist", "song"], icon: "music", risk: "reversible", describe: "Control music playback" },
];

const TRIGGER_HINTS = ["every", "when", " at ", "am", "pm", "morning", "evening", "sunset", "sunrise", "if "];

const CLARIFYING_REPLIES = [
  "I want to get this right — what should trigger it, and what should happen when it does?",
  "Can you give me a bit more detail? What kicks this off, and what should Caliber actually do?",
];

const SUMMARY_REPLIES = [
  "Got it — here's what I'll set up. Take a look on the right, and tell me if anything should change.",
  "Here's the plan. Let me know if you'd like to adjust a step or add another one.",
];

const ADDED_REPLIES = [
  "Added that to the plan.",
  "Done — I've added that step.",
];

const NO_CHANGE_REPLIES = [
  "Noted, though I didn't catch a new step to add there — try naming an app or action.",
];

function pick(list: string[], seed: number) {
  return list[seed % list.length];
}

export interface BuilderTurn {
  reply: string;
  steps: FlowStep[];
  clarifying: boolean;
}

export function respondTo(
  message: string,
  existingSteps: FlowStep[],
  turnIndex: number,
): BuilderTurn {
  const lower = message.toLowerCase();
  const matched = ACTION_VOCAB.filter((rule) =>
    rule.keywords.some((k) => lower.includes(k)),
  );
  const hasTriggerHint = TRIGGER_HINTS.some((h) => lower.includes(h));

  if (existingSteps.length === 0) {
    if (matched.length === 0) {
      return {
        reply: pick(CLARIFYING_REPLIES, turnIndex),
        steps: [],
        clarifying: true,
      };
    }

    const triggerDescription = hasTriggerHint
      ? message.trim().replace(/^./, (c) => c.toUpperCase())
      : `You ask for "${message.trim()}"`;

    const steps: FlowStep[] = [
      { kind: "trigger", icon: hasTriggerHint ? "calendar" : "mic", description: triggerDescription },
      ...dedupe(matched).slice(0, 4).map((rule) => ({
        kind: "action" as const,
        icon: rule.icon,
        risk: rule.risk,
        description: rule.describe,
      })),
    ];

    return { reply: pick(SUMMARY_REPLIES, turnIndex), steps, clarifying: false };
  }

  // Follow-up turn: append any newly-mentioned actions to the existing plan.
  const existingKeys = new Set(existingSteps.map((s) => `${s.icon}:${s.description}`));
  const additions = dedupe(matched)
    .map((rule) => ({
      kind: "action" as const,
      icon: rule.icon,
      risk: rule.risk,
      description: rule.describe,
    }))
    .filter((step) => !existingKeys.has(`${step.icon}:${step.description}`));

  if (additions.length === 0) {
    return { reply: pick(NO_CHANGE_REPLIES, turnIndex), steps: existingSteps, clarifying: false };
  }

  return {
    reply: pick(ADDED_REPLIES, turnIndex),
    steps: [...existingSteps, ...additions],
    clarifying: false,
  };
}

function dedupe(rules: ActionRule[]) {
  const seen = new Set<string>();
  return rules.filter((r) => {
    if (seen.has(r.describe)) return false;
    seen.add(r.describe);
    return true;
  });
}
