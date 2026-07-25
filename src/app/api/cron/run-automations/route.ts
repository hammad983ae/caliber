import { NextResponse } from "next/server";
import {
  listActiveAutomations,
  recordAutomationRun,
  type AutomationDoc,
} from "@/lib/firestore/automations";
import { createActivityEntry } from "@/lib/firestore/activity";
import { isConnected as isCalendarConnected, createCalendarEvent } from "@/lib/connectors/google-calendar";
import { isConnected as isSheetsConnected, appendRow } from "@/lib/connectors/google-sheets";
import { parseSchedule, isDueToday } from "@/lib/automation-schedule";
import type { LastRun } from "@/lib/automations";

/**
 * Fired by Vercel Cron (see vercel.json). There is no signed-in user for a
 * scheduled invocation, so this reads/writes across every owner directly —
 * the per-request API routes stay owner-scoped, this one is deliberately not.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization");
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const automations = await listActiveAutomations();
  const now = new Date();
  const results: Array<{ id: string; ran: boolean }> = [];

  for (const { id, data } of automations) {
    const triggerStep = data.steps.find((s) => s.kind === "trigger");
    const rule = triggerStep ? parseSchedule(triggerStep.description) : null;

    if (!isDueToday(rule, now, data.lastRunAtISO)) {
      results.push({ id, ran: false });
      continue;
    }

    await runAutomation(id, data, now);
    results.push({ id, ran: true });
  }

  return NextResponse.json({ checked: automations.length, ran: results.filter((r) => r.ran).length });
}

async function runAutomation(id: string, data: AutomationDoc, now: Date) {
  const owner = { userId: data.ownerId, orgId: data.orgId };
  const actionSteps = data.steps.filter((s) => s.kind === "action");
  const calendarStep = actionSteps.find((s) => s.app === "google_calendar");
  const sheetsStep = actionSteps.find((s) => s.app === "google_sheets");
  const otherSteps = actionSteps.filter(
    (s) => s.app !== "google_calendar" && s.app !== "google_sheets",
  );

  const summaryParts: string[] = [];
  let anySucceeded = false;
  let anyFailed = false;

  if (calendarStep) {
    const connected = await isCalendarConnected(data.ownerId);
    if (!connected) {
      anyFailed = true;
      summaryParts.push("Calendar step skipped — Google Calendar isn't connected.");
    } else {
      try {
        const start = new Date(now.getTime() + 5 * 60 * 1000);
        const end = new Date(start.getTime() + 30 * 60 * 1000);
        await createCalendarEvent(data.ownerId, {
          summary: data.name,
          startISO: start.toISOString(),
          endISO: end.toISOString(),
        });
        summaryParts.push(`Created a calendar event: "${data.name}".`);
        anySucceeded = true;
      } catch (err) {
        anyFailed = true;
        summaryParts.push(
          `Couldn't create the calendar event — ${err instanceof Error ? err.message : "unknown error"}.`,
        );
      }
    }
  }

  if (sheetsStep) {
    const connected = await isSheetsConnected(data.ownerId);
    if (!connected) {
      anyFailed = true;
      summaryParts.push("Sheets step skipped — Google Sheets isn't connected.");
    } else {
      try {
        const { updatedRange } = await appendRow(data.ownerId, {
          values: [now.toISOString(), data.name, "Triggered automatically by Caliber"],
        });
        summaryParts.push(`Logged a row to Google Sheets (${updatedRange}).`);
        anySucceeded = true;
      } catch (err) {
        anyFailed = true;
        summaryParts.push(
          `Couldn't log to Google Sheets — ${err instanceof Error ? err.message : "unknown error"}.`,
        );
      }
    }
  }

  let outcome: LastRun["outcome"];
  if (!calendarStep && !sheetsStep) {
    // Nothing real to attempt at all — not a failure, just not connected to anything real yet.
    outcome = "partial";
  } else if (anyFailed && anySucceeded) {
    outcome = "partial";
  } else if (anyFailed) {
    outcome = "failed";
  } else {
    outcome = "success";
  }

  if (otherSteps.length > 0) {
    if (outcome === "success") outcome = "partial";
    summaryParts.push(
      `${otherSteps.length} step${otherSteps.length === 1 ? "" : "s"} skipped — not connected to a real app yet.`,
    );
  }

  const nowISO = now.toISOString();
  const detail = summaryParts.join(" ") || "Ran automatically.";

  await recordAutomationRun(id, {
    lastRun: { at: "Just now", outcome, detail },
    lastRunAtISO: nowISO,
  });

  await createActivityEntry(owner, {
    automationId: id,
    automationName: data.name,
    connectors: data.connectors,
    status: outcome,
    at: "Just now",
    summary: detail,
    undoable: false,
  });
}
