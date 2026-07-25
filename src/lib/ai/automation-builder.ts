import "server-only";
import type { FlowStep, FlowStepKind, StepRisk } from "@/lib/automations";
import { CONNECTORS, CONNECTOR_IDS, isConnectorId } from "@/lib/connector-registry";

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const ICONS = [
  "mic",
  "calendar",
  "message",
  "mail",
  "bulb",
  "lock",
  "check",
  "bell",
  "music",
  "doc",
  "hash",
  "grid",
] as const;

const KINDS: FlowStepKind[] = ["trigger", "condition", "action"];
const RISKS: StepRisk[] = ["read-only", "reversible", "confirm"];
const APP_VALUES = [...CONNECTOR_IDS, "none"] as const;

const CONNECTOR_DESCRIPTIONS = CONNECTOR_IDS.map((id) => `${id} (${CONNECTORS[id].name})`).join(
  ", ",
);

const SYSTEM_INSTRUCTION = `
You are Caliber's automation-builder assistant. Users describe, in their own words, something they want automated — Caliber runs it on their behalf. Turn each request into a short trigger + action flow.

Rules:
- Every automation needs exactly one "trigger" step (what starts it) and one or more "action" steps (what it does). Add a "condition" step between them only if the user described one (e.g. "only if...", "but not on weekends").
- icon must be one of: ${ICONS.join(", ")} — pick whichever best represents that step (calendar for time/date/meeting triggers, mic for spoken-phrase triggers, mail for email, message for chat apps like Slack, bulb for lights, lock for door locks, check for tasks, bell for notifications, music for audio, doc for notes/documents, hash for channels/keywords, grid for spreadsheets).
- app identifies which specific connected app a step needs, so we can show its logo and let the user connect it. Set it to one of: ${CONNECTOR_DESCRIPTIONS} when the step clearly matches one of those apps. Otherwise (a different app we don't support yet, a generic phone/voice trigger, or a time-based trigger) set app to "none".
- risk applies only to action steps: "read-only" (just observes data, e.g. summarizing), "reversible" (an easily-undone side effect, e.g. a Slack status, dimming lights, blocking calendar time), or "confirm" (irreversible or higher-stakes, e.g. locking/unlocking a door, sending an email to someone else, deleting something).
- If the request is genuinely too vague to build anything (no discernible trigger or action at all), set clarifying=true, steps=[], and ask exactly one focused clarifying question in reply.
- Otherwise set clarifying=false, populate steps with the full current draft (not a diff), and write a short (1-2 sentence) conversational reply confirming what you set up. If part of the request needs an app we don't support yet, still include that step (app="none") and mention the limitation briefly in reply.
- When continuing an existing draft, treat the given draft steps as the current state and return the complete updated list — keep what's still relevant, change or add only what the new message asks for.
- Keep descriptions short, concrete, and in plain English (e.g. "Block 3 hours as 'Focus time'", not "Trigger calendar API").
`.trim();

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    reply: { type: "STRING" },
    clarifying: { type: "BOOLEAN" },
    steps: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          kind: { type: "STRING", enum: KINDS },
          icon: { type: "STRING", enum: [...ICONS] },
          description: { type: "STRING" },
          risk: { type: "STRING", enum: RISKS },
          app: { type: "STRING", enum: [...APP_VALUES] },
        },
        required: ["kind", "icon", "description", "app"],
      },
    },
  },
  required: ["reply", "clarifying", "steps"],
};

export interface BuilderTurn {
  reply: string;
  steps: FlowStep[];
  clarifying: boolean;
}

export async function generateAutomationTurn(
  history: { role: "user" | "assistant"; text: string }[],
  existingSteps: FlowStep[],
): Promise<BuilderTurn> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set.");
  }

  const transcript = history
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.text}`)
    .join("\n");

  const draftNote =
    existingSteps.length > 0
      ? `\n\nCurrent draft steps (JSON): ${JSON.stringify(existingSteps)}`
      : "";

  const prompt = `Conversation so far:\n${transcript}${draftNote}\n\nRespond with the next turn.`;

  const res = await fetch(`${ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini request failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    throw new Error("Gemini returned no content.");
  }

  const parsed = JSON.parse(text) as {
    reply: string;
    clarifying: boolean;
    steps: Array<{ kind: string; icon: string; description: string; risk?: string; app?: string }>;
  };

  const steps: FlowStep[] = parsed.steps.map((s) => ({
    kind: (KINDS as string[]).includes(s.kind) ? (s.kind as FlowStepKind) : "action",
    icon: s.icon,
    description: s.description,
    risk: (RISKS as string[]).includes(s.risk ?? "") ? (s.risk as StepRisk) : undefined,
    app: s.app && isConnectorId(s.app) ? s.app : undefined,
  }));

  return { reply: parsed.reply, clarifying: parsed.clarifying, steps };
}
