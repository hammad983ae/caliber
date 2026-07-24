"use server";

import { auth } from "@clerk/nextjs/server";
import { createCalendarEvent } from "@/lib/connectors/google-calendar";
import { createActivityEntry } from "@/lib/firestore/activity";
import { updateAutomation } from "@/lib/firestore/automations";

export async function runCalendarAutomation(automationId: string, automationName: string) {
  const { userId, orgId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Not signed in." };
  }

  const owner = { userId, orgId: orgId ?? null };
  const now = new Date();
  const start = new Date(now.getTime() + 5 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  try {
    const event = await createCalendarEvent(userId, {
      summary: automationName,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    });

    await Promise.all([
      updateAutomation(automationId, owner, {
        lastRun: { at: "Just now", outcome: "success", detail: "Created a real calendar event" },
        lastRunAtISO: now.toISOString(),
      }),
      createActivityEntry(owner, {
        automationId,
        automationName,
        connectors: ["calendar"],
        status: "success",
        at: "Just now",
        summary: `Created a calendar event: "${automationName}".`,
        undoable: false,
      }),
    ]);

    return { ok: true as const, link: event.htmlLink };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create the event.";

    await Promise.all([
      updateAutomation(automationId, owner, {
        lastRun: { at: "Just now", outcome: "failed", detail: message },
        lastRunAtISO: now.toISOString(),
      }).catch(() => {}),
      createActivityEntry(owner, {
        automationId,
        automationName,
        connectors: ["calendar"],
        status: "failed",
        at: "Just now",
        summary: `Couldn't create the calendar event — ${message}`,
        undoable: false,
      }).catch(() => {}),
    ]);

    return { ok: false as const, error: message };
  }
}
