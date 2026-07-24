"use server";

import { auth } from "@clerk/nextjs/server";
import { createCalendarEvent } from "@/lib/connectors/google-calendar";

export async function runCalendarAutomation(summary: string) {
  const { userId } = await auth();
  if (!userId) {
    return { ok: false as const, error: "Not signed in." };
  }

  const start = new Date(Date.now() + 5 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  try {
    const event = await createCalendarEvent(userId, {
      summary,
      startISO: start.toISOString(),
      endISO: end.toISOString(),
    });
    return { ok: true as const, link: event.htmlLink };
  } catch (err) {
    return {
      ok: false as const,
      error: err instanceof Error ? err.message : "Failed to create the event.",
    };
  }
}
