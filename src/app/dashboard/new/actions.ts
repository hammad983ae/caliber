"use server";

import { auth } from "@clerk/nextjs/server";
import { generateAutomationTurn as callGemini } from "@/lib/ai/automation-builder";
import type { FlowStep } from "@/lib/automations";

export async function generateAutomationTurn(
  history: { role: "user" | "assistant"; text: string }[],
  existingSteps: FlowStep[],
) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Not signed in." };
  }

  try {
    const turn = await callGemini(history, existingSteps);
    return { ok: true as const, turn };
  } catch (err) {
    console.error("[automation-builder] Gemini call failed:", err);
    return {
      ok: false as const,
      error: "Sorry, I couldn't process that just now — try again in a moment.",
    };
  }
}
