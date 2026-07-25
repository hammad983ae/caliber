import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { isConnected as isGoogleCalendarConnected } from "@/lib/connectors/google-calendar";
import { getMockConnections } from "@/lib/connectors/mock-connectors";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [google_calendar, mockConnections] = await Promise.all([
    isGoogleCalendarConnected(userId),
    getMockConnections(userId),
  ]);

  return NextResponse.json({ google_calendar, ...mockConnections });
}
