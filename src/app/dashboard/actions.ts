"use server";

import { auth } from "@clerk/nextjs/server";
import { createCalendarEvent, isConnected as isCalendarConnected } from "@/lib/connectors/google-calendar";
import { appendRow, isConnected as isSheetsConnected } from "@/lib/connectors/google-sheets";
import { createActivityEntry } from "@/lib/firestore/activity";
import { updateAutomation } from "@/lib/firestore/automations";
import type { FlowStep } from "@/lib/automations";

export async function runAutomationNow(automationId: string, automationName: string, steps: FlowStep[]) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Not signed in." };
  }

  const owner = { userId, orgId: orgId ?? null };
  const now = new Date();

  const messages: string[] = [];
  const connectors: string[] = [];
  let link: string | undefined;
  let anySucceeded = false;
  let anyFailed = false;

  const hasCalendarStep = steps.some((s) => s.kind === "action" && s.app === "google_calendar");
  const hasSheetsStep = steps.some((s) => s.kind === "action" && s.app === "google_sheets");

  if (hasCalendarStep) {
    connectors.push("calendar");
    if (await isCalendarConnected(userId)) {
      try {
        const start = new Date(now.getTime() + 5 * 60 * 1000);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        const event = await createCalendarEvent(userId, {
          summary: automationName,
          startISO: start.toISOString(),
          endISO: end.toISOString(),
        });
        messages.push(`Created a calendar event: "${automationName}".`);
        link = event.htmlLink;
        anySucceeded = true;
      } catch (err) {
        anyFailed = true;
        messages.push(
          `Couldn't create the calendar event — ${err instanceof Error ? err.message : "unknown error"}.`,
        );
      }
    } else {
      anyFailed = true;
      messages.push("Calendar step skipped — Google Calendar isn't connected.");
    }
  }

  if (hasSheetsStep) {
    connectors.push("grid");
    if (await isSheetsConnected(userId)) {
      try {
        const { updatedRange } = await appendRow(userId, {
          values: [now.toISOString(), automationName, "Triggered manually via Caliber"],
        });
        messages.push(`Logged a row to Google Sheets (${updatedRange}).`);
        anySucceeded = true;
      } catch (err) {
        anyFailed = true;
        messages.push(
          `Couldn't log to Google Sheets — ${err instanceof Error ? err.message : "unknown error"}.`,
        );
      }
    } else {
      anyFailed = true;
      messages.push("Sheets step skipped — Google Sheets isn't connected.");
    }
  }

  if (!hasCalendarStep && !hasSheetsStep) {
    return { ok: false as const, error: "This automation has no real steps to run yet." };
  }

  const outcome: "success" | "partial" | "failed" =
    anyFailed && anySucceeded ? "partial" : anyFailed ? "failed" : "success";
  const detail = messages.join(" ");

  await Promise.all([
    updateAutomation(automationId, owner, {
      lastRun: { at: "Just now", outcome, detail },
      lastRunAtISO: now.toISOString(),
    }).catch(() => {}),
    createActivityEntry(owner, {
      automationId,
      automationName,
      connectors,
      status: outcome,
      at: "Just now",
      summary: detail,
      undoable: false,
    }).catch(() => {}),
  ]);

  return anySucceeded
    ? { ok: true as const, message: detail, link }
    : { ok: false as const, error: detail };
}
